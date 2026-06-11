import { prisma } from "@/lib/prisma";
import { Layers, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

async function getRecentProducts() {
  try {
    return await prisma.product.findMany({
      take: 6,
      orderBy: {
        id: "desc",
      },
      include: {
        category: true,
      },
    });
  } catch (error) {
    console.error("HOME_PRODUCTS_FETCH_ERROR:", error);
    return [];
  }
}

export default async function RecentArrivals() {
  const recentProducts = await getRecentProducts();

  return (
    <section className="bg-neutral-50/30 py-16 px-4 sm:px-6 lg:px-8 border-b">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
              Recent Workshop Arrivals
            </h2>
            <p className="text-xs text-neutral-400">
              The latest precision instruments added straight to the ecosystem ledger index.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-semibold gap-1 text-neutral-600 hover:text-neutral-900 w-fit px-3 rounded-lg"
            asChild
          >
            <Link href="/explore">
              See all arrivals <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Product Grid */}
        {recentProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200/60 max-w-sm mx-auto">
            <p className="text-xs text-neutral-400 font-medium">
              No recent system hardware records indexed yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentProducts.map((product) => {
              const displayImage =
                product.images?.[0] ||
                "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&auto=format&fit=crop&q=60";
              
              // BULLETPROOF TS EVALUATION (Bypasses Decimal / never issues entirely)
              const rawPrice = product.price ? String(product.price) : "0";
              const formattedPrice = Number(parseFloat(rawPrice)).toFixed(2);

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-md flex flex-col h-full"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-50 border-b border-neutral-100 block"
                  >
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </Link>

                  <CardContent className="p-5 flex-grow space-y-2.5">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                      <Layers className="h-3 w-3 text-neutral-300" />
                      {product.category?.name || "General"}
                    </div>

                    <div className="space-y-1">
                      <Link href={`/products/${product.slug}`} className="block">
                        <h3 className="text-sm font-bold tracking-tight text-neutral-800 truncate group-hover:text-neutral-950 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-neutral-50/60 mt-auto">
                    <span className="text-base font-black text-neutral-900 tracking-tight">
                      ${formattedPrice}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg font-semibold text-[11px] px-3 h-8 shadow-sm transition-all cursor-pointer"
                      asChild
                    >
                      <Link href={`/products/${product.slug}`}>
                        View Details
                      </Link>
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