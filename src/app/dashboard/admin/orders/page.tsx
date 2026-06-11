"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  ArrowLeft,
  Truck,
  PackageCheck,
  Hourglass,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OrderData {
  id: string;
  userId: string;
  totalAmount: number;
  status: "PENDING" | "SHIPPED" | "DELIVERED";
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrdersManagementPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = () => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch((err) => console.error("FETCH_ADMIN_ORDERS_ERROR:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const changeOrderStatus = async (orderId: string, targetStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: targetStatus }),
      });

      if (res.ok) {
        // Optimistically update status state values locally
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: targetStatus as any } : o,
          ),
        );
      } else {
        alert("Could not update shipping parameter.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50/50">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back navigation header line anchor */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white border"
            asChild
          >
            <Link href="/dashboard/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Order Deliveries
            </h1>
            <p className="text-xs text-neutral-400">
              Dispatch items and adjust fulfillment stages across customer
              accounts.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 max-w-sm mx-auto space-y-3">
            <p className="text-sm font-semibold text-neutral-900">
              No transactions recorded yet
            </p>
            <p className="text-xs text-neutral-400">
              Purchases will appear here instantly as users complete checkout
              workflows.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden border border-neutral-200/80 bg-white shadow-sm rounded-2xl"
              >
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  {/* Ledger Metrics Breakdown Block */}
                  <div className="space-y-2 flex-grow min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md truncate max-w-[240px]">
                        ID: {order.id}
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-md font-bold px-2 py-0.5"
                      >
                        {order.paymentStatus}
                      </Badge>
                      <Badge
                        className={`rounded-md gap-1 font-bold px-2 py-0.5 text-white ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-600"
                            : order.status === "SHIPPED"
                              ? "bg-blue-600"
                              : "bg-amber-500"
                        }`}
                      >
                        {order.status === "DELIVERED" && (
                          <PackageCheck className="h-3 w-3" />
                        )}
                        {order.status === "SHIPPED" && (
                          <Truck className="h-3 w-3" />
                        )}
                        {order.status === "PENDING" && (
                          <Hourglass className="h-3 w-3" />
                        )}
                        {order.status}
                      </Badge>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs text-neutral-400 truncate">
                        <span className="font-medium text-neutral-500">
                          Customer Identity UUID:
                        </span>{" "}
                        {order.userId}
                      </p>
                      <p className="text-xs text-neutral-400">
                        <span className="font-medium text-neutral-500">
                          Date Logged:
                        </span>{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="text-base font-black text-neutral-900 pt-1">
                      Total Invoice: ${Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>

                  {/* Status Mutation Dropdown Trigger Handle Component */}
                  <div className="w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Fulfillment Action
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        changeOrderStatus(order.id, e.target.value)
                      }
                      className="h-10 w-full md:w-48 px-3 rounded-xl border border-neutral-200 text-xs font-bold bg-neutral-50 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                    >
                      <option value="PENDING">Processing (Pending)</option>
                      <option value="SHIPPED">
                        Out For Delivery (Shipped)
                      </option>
                      <option value="DELIVERED">Delivered (Completed)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
