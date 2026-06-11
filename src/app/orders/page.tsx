import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function UserOrdersPage() {
  // 1. Authenticate the incoming user session pass
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // 2. Query only the rows that match this customer's user ID
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 min-h-screen py-12">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
        Your Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-2xl bg-white p-6">
          <p className="text-sm font-medium text-neutral-950">
            No orders found
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            When you buy handmade items, your package histories will display
            here.
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <Card
            key={order.id}
            className="border border-neutral-200 shadow-sm rounded-2xl overflow-hidden bg-white"
          >
            <CardHeader className="bg-neutral-50/60 border-b p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  Order ID
                </p>
                <p className="text-xs font-mono text-neutral-700 truncate max-w-xs">
                  {order.id}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold rounded-md"
                >
                  {order.paymentStatus}
                </Badge>
                <Badge
                  className={`font-bold rounded-md text-white ${
                    order.status === "DELIVERED"
                      ? "bg-emerald-600"
                      : order.status === "SHIPPED"
                        ? "bg-blue-600"
                        : "bg-amber-500"
                  }`}
                >
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-neutral-900">
                    ${Number(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <hr className="border-neutral-100" />
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-medium text-neutral-500">
                  Total Paid Amount:
                </span>
                <span className="text-base font-black text-neutral-900">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
