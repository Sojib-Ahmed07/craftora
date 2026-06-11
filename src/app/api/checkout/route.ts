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

    const { items } = await req.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items selected" }, { status: 400 });
    }

    const productIds = items.map((item: any) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const lineItems = items.map((item: any) => {
      const product = dbProducts.find((p) => p.id === item.id);
      if (!product) throw new Error(`Product ${item.id} not found`);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images,
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity: item.quantity,
      };
    });

    // FIX: Dynamically detect the server's domain protocol + host name if the env variable is missing
    const origin = process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "http://localhost:3000";

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/dashboard/user/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        userId: session.user.id,
        cartPayload: JSON.stringify(
          items.map((item: any) => ({ id: item.id, quantity: item.quantity }))
        ),
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error("STRIPE_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}