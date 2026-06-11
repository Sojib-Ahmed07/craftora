"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
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
        // Refresh the page data so any cart count badges update automatically
        router.refresh(); 
        alert("Added to cart!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add item.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error occurred.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="w-full h-10 rounded-xl bg-neutral-950 text-neutral-50 hover:bg-neutral-800 text-xs font-semibold gap-2 cursor-pointer transition-all"
    >
      {isAdding ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
        </>
      )}
    </Button>
  );
}