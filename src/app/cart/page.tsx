"use client";

import { useEffect, useState } from "react";
import { Loader2, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckoutButton } from "@/components/checkout-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CartItemData {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string | number;
    images: string[];
    description: string;
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = () => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = items.reduce((acc, item) => {
    const price = typeof item.product.price === "number" ? item.product.price : parseFloat(item.product.price);
    return acc + price * item.quantity;
  }, 0);

  // Convert current state into the explicit checkout array format: [{ id: "...", quantity: 1 }]
  const checkoutPayload = items.map((item) => ({
    id: item.product.id,
    quantity: item.quantity,
  }));

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
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 max-w-md mx-auto space-y-4">
            <ShoppingBag className="h-10 w-10 text-neutral-300 mx-auto" />
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Your bag is empty</h3>
              <p className="text-xs text-neutral-400 mt-1">Add items from the store to unlock checkout.</p>
            </div>
            <Link href="/products" className="inline-block text-xs font-bold text-neutral-500 underline hover:text-neutral-900">
              Browse Storefront
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* List of active cart rows */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const price = typeof item.product.price === "number" ? item.product.price : parseFloat(item.product.price);
                const itemImg = item.product.images?.[0] || "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=300";

                return (
                  <Card key={item.id} className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
                    <CardContent className="p-4 flex gap-4 items-center">
                      <img src={itemImg} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl bg-neutral-50 border" />
                      <div className="flex-grow min-w-0">
                        <h3 className="text-sm font-semibold text-neutral-900 truncate">{item.product.name}</h3>
                        <p className="text-xs text-neutral-400 mt-0.5">Quantity: {item.quantity}</p>
                        <p className="text-sm font-bold text-neutral-900 mt-2">${(price * item.quantity).toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Sidebar Summary Area holding the checkout activation element */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <hr className="border-neutral-100" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* PLUG IN YOUR ORIGINAL STRIPE CHECKOUT BUTTON COMPONENT */}
              <CheckoutButton cartItems={checkoutPayload} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}