// src/app/dashboard/admin/products/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { EditProductForm } from "./edit-form";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

async function getProductAndCategories(id: string) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { product, categories };
}

export default async function EditProductPage({ params }: EditPageProps) {
  const resolvedParams = await params;
  const { product, categories } = await getProductAndCategories(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link
            href="/dashboard/admin/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to inventory core
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Edit Product Properties
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Modify name, descriptive copy, category tags, or foundational structural metadata.
            </p>
          </div>

          <EditProductForm initialProduct={product} categories={categories} />
        </div>
      </div>
    </div>
  );
}