import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductActionWrapper } from "@/components/product-action-wrapper";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductPageProps {
  params: Promise<Record<string, string | undefined>>;
}

async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const displayImage =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&auto=format&fit=crop";

  const rawPrice = product.price as unknown;
  const formattedPrice =
    typeof rawPrice === "number"
      ? rawPrice.toFixed(2)
      : parseFloat((rawPrice as string) || "0").toFixed(2);

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-neutral-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to storefront
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden aspect-square shadow-sm relative">
            {isOutOfStock && (
              <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[1px] z-10" />
            )}
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-neutral-500 font-medium px-2.5 py-0.5 rounded-md gap-1 bg-white shadow-sm"
                >
                  <Layers className="h-3 w-3 text-neutral-400" />
                  {product.category?.name || "General Specification"}
                </Badge>

                {isOutOfStock ? (
                  <Badge
                    variant="destructive"
                    className="font-semibold gap-1 rounded-md"
                  >
                    <XCircle className="h-3 w-3" /> Out of stock
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700 border-emerald-100 font-semibold gap-1 rounded-md"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />{" "}
                    {product.stock} Units Available
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                {product.name}
              </h1>

              <div className="pt-2">
                <span className="text-3xl font-black text-neutral-900 tracking-tight">
                  ${formattedPrice}
                </span>
                <span className="text-xs text-neutral-400 font-medium ml-2">
                  USD + Local Taxes
                </span>
              </div>
            </div>

            <hr className="border-neutral-200" />

            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                Detailed Overview
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line font-normal">
                {product.description}
              </p>
            </div>

            <hr className="border-neutral-200" />

            {/* LIVE DYNAMIC SYSTEM ENTRY BUTTON */}
            <div className="pt-2">
              <ProductActionWrapper
                productId={product.id}
                isOutOfStock={isOutOfStock}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <Card className="border border-neutral-200/60 shadow-none bg-neutral-50/50">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                  <Truck className="h-5 w-5 text-neutral-500" />
                  <span className="text-xs font-semibold text-neutral-800">
                    Secure Logistics
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Tracked global routing
                  </span>
                </CardContent>
              </Card>

              <Card className="border border-neutral-200/60 shadow-none bg-neutral-50/50">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                  <ShieldCheck className="h-5 w-5 text-neutral-500" />
                  <span className="text-xs font-semibold text-neutral-800">
                    Authentic Asset
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Verified system ledger
                  </span>
                </CardContent>
              </Card>

              <Card className="border border-neutral-200/60 shadow-none bg-neutral-50/50">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                  <RotateCcw className="h-5 w-5 text-neutral-500" />
                  <span className="text-xs font-semibold text-neutral-800">
                    Flexible Returns
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    30-day compliance
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
