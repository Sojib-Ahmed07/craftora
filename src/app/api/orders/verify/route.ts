import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia" as any,
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID missing" },
        { status: 400 },
      );
    }

    // FIX 1: Use 'paymentId' instead of 'stripeSessionId' to look up duplicates
    const existingOrder = await prisma.order.findFirst({
      where: { paymentId: sessionId },
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: "Order already updated.",
      });
    }

    // 2. Query Stripe's servers directly for the session context validation pass
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Transaction verification failed" },
        { status: 400 },
      );
    }

    const userId = stripeSession.metadata?.userId;
    const cartPayload = stripeSession.metadata?.cartPayload;

    if (!userId || !cartPayload || userId !== session.user.id) {
      return NextResponse.json(
        { error: "Invalid integrity payload data" },
        { status: 400 },
      );
    }

    const parsedItems = JSON.parse(cartPayload);

    // 3. Process database mutation transactions atomically
    await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          userId: userId,
          totalAmount: (stripeSession.amount_total || 0) / 100,
          status: "processing", // Matches your default schema string rule style
          isPaid: true, // FIX 2: Uses your schema's 'isPaid' boolean property
          paymentId: sessionId, // FIX 3: Saves the Stripe session ID into your 'paymentId' slot
          items: {
            create: parsedItems.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              // Make sure your OrderItem model properties match your schema fields as well!
            })),
          },
        },
      });

      // Clear matching system temporary cart values
      const userCart = await tx.cart.findUnique({ where: { userId } });
      if (userCart) {
        await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("VERIFICATION_ERROR:", error);
    return NextResponse.json(
      { error: "Internal order generation error" },
      { status: 500 },
    );
  }
}
