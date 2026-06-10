"use client";

import { useState, useEffect } from "react";
import { Loader2, ShoppingBag, Layers, ShoppingCart } from "lucide-react";
import Link from "next/link";

// Using your existing UI component library modules straight out of the box
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export default function PublicShopCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error("SHOP_FETCH_ERROR:", err))
      .finally(() => setLoading(false));
  }, []);

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
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Block */}
        <div className="space-y-2 text-center max-w-lg mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Our Storefront
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Premium products pulled and compiled in real time directly from your
            Neon database catalog.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/80 max-w-md mx-auto space-y-3 shadow-sm">
            <ShoppingBag className="h-10 w-10 text-neutral-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-neutral-900">
                No merchandise found
              </h3>
              <p className="text-xs text-neutral-400">
                The storefront catalog is currently unpopulated.
              </p>
            </div>
          </div>
        ) : (
          /* Responsive Product Grid Matrix Configuration */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const displayImage =
                product.images?.[0] ||
                "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&auto=format&fit=crop&q=60";
              const formattedPrice =
                typeof product.price === "number"
                  ? product.price.toFixed(2)
                  : parseFloat(product.price).toFixed(2);
              const isOutOfStock = product.stock <= 0;

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-md flex flex-col h-full"
                >
                  {/* Image Block: Wrapped inside Link for elegant navigation mapping */}
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </Link>

                  {/* Content Details Block */}
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

                  {/* Actions and Price Footer */}
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
                      disabled={isOutOfStock}
                      size="sm"
                      onClick={() =>
                        alert(`${product.name} added to checkout stream.`)
                      }
                      className="rounded-xl font-semibold text-xs gap-1.5 px-4 h-10 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
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
