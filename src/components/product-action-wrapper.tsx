"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";

interface ProductActionWrapperProps {
  productId: string;
  isOutOfStock: boolean;
}

export function ProductActionWrapper({ productId, isOutOfStock }: ProductActionWrapperProps) {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        router.refresh();
        alert("Added to shopping cart!");
      } else {
        const data = await response.json();
        alert(data.error || "Please sign in to modify active cart state.");
      }
    } catch (error) {
      console.error(error);
      alert("Network failure.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      disabled={isOutOfStock || isAdding}
      onClick={handleAddToCart}
      size="lg"
      className="w-full sm:w-auto min-w-[200px] h-12 rounded-xl text-sm font-semibold tracking-wide gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
    >
      {isAdding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      Add to Cart
    </Button>
  );
}