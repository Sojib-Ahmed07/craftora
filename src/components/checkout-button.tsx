"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";

interface CheckoutButtonProps {
  cartItems: { id: string; quantity: number }[];
}

export function CheckoutButton({ cartItems }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout generation failed.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Network transmission error.");
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || cartItems.length === 0}
      className="w-full h-11 rounded-xl bg-neutral-950 text-neutral-50 hover:bg-neutral-800 font-bold transition-all gap-2 cursor-pointer"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Moving to Stripe Sandbox...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4" /> Pay with Stripe Test Card
        </>
      )}
    </Button>
  );
}