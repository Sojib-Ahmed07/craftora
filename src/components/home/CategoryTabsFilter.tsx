"use client";

import { useState, useEffect } from "react";
import { Layers, Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mapped exactly to your live Postgres database dumps
const DATABASE_CATEGORIES = [
  { name: "All Products", slug: "all" },
  { name: "Electronics", slug: "electronics" },
  { name: "Clothing", slug: "clothing" },
  { name: "Accessories", slug: "accessories" },
];

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: any;
  images: string[];
  category?: { name: string; slug: string };
}

export default function CategoryTabsFilter() {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getOnDemandCategoryProducts() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/products/filter?category=${activeTab}`,
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("FRONTEND_QUERY_DISPATCH_FAIL:", err);
      } finally {
        setLoading(false);
      }
    }

    getOnDemandCategoryProducts();
  }, [activeTab]);

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Descriptive Section Heading Container */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            <Layers className="h-3 w-3" />
            Live Database Ledger
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
            Browse Storefront Collections
          </h2>
          <p className="text-xs text-neutral-400">
            Query live inventories in real-time straight out of the active
            schema classification tables.
          </p>
        </div>

        {/* Dynamic Category Navigation Buttons Row */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-neutral-100">
          {DATABASE_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveTab(cat.slug)}
              className={cn(
                "h-9 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none",
                activeTab === cat.slug
                  ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100/70 hover:text-neutral-900",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Dynamic Matrix Frame View Layer */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-2">
            <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            <p className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase">
              Fetching matching table rows...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50/40 rounded-2xl border border-neutral-200/60 max-w-sm mx-auto">
            <p className="text-xs text-neutral-400 font-medium">
              No items found for this classification layer.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              // Parse image arrays strings correctly out of the DB arrays
              let displayImage =
                "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&auto=format&fit=crop&q=60";
              if (product.images && product.images.length > 0) {
                try {
                  const parsed =
                    typeof product.images === "string"
                      ? JSON.parse(product.images)
                      : product.images;
                  if (Array.isArray(parsed) && parsed[0]) {
                    displayImage = parsed[0];
                  }
                } catch {
                  if (product.images[0]) displayImage = product.images[0];
                }
              }

              // Parse Prisma decimals safely to match Next build execution rules
              const rawPrice = product.price ? String(product.price) : "0";
              const formattedPrice = Number(parseFloat(rawPrice)).toFixed(2);

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-md flex flex-col h-full"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-square w-full overflow-hidden bg-neutral-50 border-b border-neutral-100 block"
                  >
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </Link>

                  <CardContent className="p-4 flex-grow space-y-1.5">
                    <Link href={`/products/${product.slug}`} className="block">
                      <h3 className="text-xs font-bold tracking-tight text-neutral-800 truncate group-hover:text-neutral-950 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto border-t border-neutral-50/50 pt-3">
                    <span className="text-sm font-black text-neutral-900 tracking-tight">
                      ${formattedPrice}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg font-semibold text-[10px] px-2.5 h-7 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 cursor-pointer"
                      asChild
                    >
                      <Link href={`/products/${product.slug}`}>Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
