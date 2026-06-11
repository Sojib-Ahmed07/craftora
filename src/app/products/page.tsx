"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  ShoppingBag,
  Layers,
  ShoppingCart,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  images: string[];
  stock: number;
  category: Category;
}

// Statically mapping options to match your explicit database dump categories
const FILTER_CATEGORIES = [
  { name: "All Products", slug: "all" },
  { name: "Electronics", slug: "electronics" },
  { name: "Clothing", slug: "clothing" },
  { name: "Accessories", slug: "accessories" },
];

export default function PublicShopCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  // New States for Live Workspace Segmentation
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error("SHOP_FETCH_ERROR:", err))
      .finally(() => setLoading(false));
  }, []);

  // Optimized Client-Side Processing Matrix Array Reducer
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.slug?.toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleAddToCart = async (productId: string) => {
    setAddingToCartId(productId);
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        router.refresh();
        alert("Item added to cart successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Please log in to add items to your cart.");
      }
    } catch (error) {
      console.error(error);
      alert("Network communication error.");
    } finally {
      setAddingToCartId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50/50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
          <p className="text-xs font-medium text-neutral-400">
            Loading catalog items...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title Content Block */}
        <div className="space-y-2 text-center max-w-lg mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Our Storefront
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Premium products pulled and compiled in real time directly from your
            database catalog.
          </p>
        </div>

        {/* RECONFIGURED FILTER ARCHITECTURE BAR (Categories Left | Search Input Right) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm">
          {/* Categories Horizontal Stream Segment Container */}
          <div className="flex flex-wrap gap-1.5 order-2 md:order-1 w-full md:w-auto">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "h-9 px-3.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none whitespace-nowrap",
                  selectedCategory === cat.slug
                    ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200/60 hover:bg-neutral-100 hover:text-neutral-900",
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Interactive Input Search Wrapper Node */}
          <div className="relative w-full md:w-72 order-1 md:order-2">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search catalog products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-10 rounded-xl text-xs bg-neutral-50/50 border-neutral-200 focus-visible:ring-1 focus-visible:ring-neutral-400 placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Dynamic Display Grid Loop Matrix */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/80 max-w-md mx-auto space-y-3 shadow-sm">
            <ShoppingBag className="h-10 w-10 text-neutral-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-neutral-900">
                No matching merchandise found
              </h3>
              <p className="text-xs text-neutral-400">
                Adjust your search queries or switch category nodes to look up
                alternatives.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const displayImage =
                product.images?.[0] ||
                "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&auto=format&fit=crop&q=60";

              const formattedPrice =
                typeof product.price === "number"
                  ? product.price.toFixed(2)
                  : parseFloat(
                      product.price ? String(product.price) : "0",
                    ).toFixed(2);

              const isOutOfStock = product.stock <= 0;
              const isCurrentlyAdding = addingToCartId === product.id;

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-md flex flex-col h-full"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-square w-full overflow-hidden bg-neutral-50 border-b border-neutral-100 block"
                  >
                    {isOutOfStock && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-900/40 backdrop-blur-[1.5px]">
                        <Badge
                          variant="destructive"
                          className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm"
                        >
                          Sold Out
                        </Badge>
                      </div>
                    )}
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </Link>

                  <CardContent className="p-5 flex-grow space-y-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      <Layers className="h-3 w-3 text-neutral-300" />
                      {product.category?.name || "General"}
                    </div>

                    <div className="space-y-1.5">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block"
                      >
                        <h3 className="text-sm font-semibold tracking-tight text-neutral-800 line-clamp-2 min-h-[40px] group-hover:text-neutral-950 transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0 flex items-center justify-between gap-4 border-t border-neutral-50/60 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                        Price
                      </span>
                      <span className="text-lg font-extrabold text-neutral-900 tracking-tight">
                        ${formattedPrice}
                      </span>
                    </div>

                    <Button
                      disabled={isOutOfStock || isCurrentlyAdding}
                      size="sm"
                      onClick={() => handleAddToCart(product.id)}
                      className="rounded-xl font-semibold text-xs gap-1.5 px-4 h-10 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                    >
                      {isCurrentlyAdding ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-3.5 w-3.5" />
                      )}
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
