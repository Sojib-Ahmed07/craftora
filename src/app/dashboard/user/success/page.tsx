import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia" as any,
});

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/dashboard/user");
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    if (checkoutSession.payment_status !== "paid") {
      throw new Error("Payment unverified");
    }

    const paymentId = checkoutSession.payment_intent as string;

    const existingOrder = await prisma.order.findFirst({
      where: { paymentId },
    });

    if (!existingOrder) {
      const userId = checkoutSession.metadata?.userId;
      const cartPayload = checkoutSession.metadata?.cartPayload;

      if (userId && cartPayload) {
        const parsedItems = JSON.parse(cartPayload);
        const totalAmount = (checkoutSession.amount_total || 0) / 100;

        await prisma.$transaction(async (tx) => {
          const order = await tx.order.create({
            data: {
              userId,
              totalAmount,
              isPaid: true,
              status: "completed",
              paymentId,
            },
          });

          for (const item of parsedItems) {
            const product = await tx.product.findUnique({
              where: { id: item.id },
            });

            if (product) {
              await tx.orderItem.create({
                data: {
                  orderId: order.id,
                  productId: product.id,
                  quantity: item.quantity,
                  price: product.price,
                },
              });

              await tx.product.update({
                where: { id: product.id },
                data: { stock: { decrement: item.quantity } },
              });
            }
          }

          await tx.cart.deleteMany({ where: { userId } });
        });
      }
    }
  } catch (error) {
    console.error("VERIFICATION_FAILURE:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-neutral-200 text-center">
          <p className="text-sm font-bold text-red-600">
            Verification Engine Interrupted.
          </p>
          <Link
            href="/cart"
            className="mt-4 inline-block text-xs font-semibold text-neutral-900 underline"
          >
            Return to Bag
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-neutral-200 text-center space-y-6">
        <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-neutral-900">
            Order Confirmed!
          </h1>
          <p className="text-xs text-neutral-500">
            Your mock transaction has cleared and logged cleanly into Postgres.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard/user"
            className="inline-flex items-center gap-1.5 justify-center w-full h-10 rounded-xl bg-neutral-950 text-neutral-50 hover:bg-neutral-800 text-xs font-semibold transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Return to Workspace
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
