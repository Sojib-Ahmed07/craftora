"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  ArrowLeft,
  Package,
  Layers,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
// 1. Import your new Cloudinary image uploader component
import { ImageUploader } from "@/components/admin/image-uploader";

interface Category {
  id: string;
  name: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // FIX 1: Add a managed React state array tracking variable for uploaded Cloudinary asset URLs
  const [images, setImages] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([
    { id: "fallback-electronics", name: "Electronics (Local Backup)" },
    { id: "fallback-clothing", name: "Clothing & Apparel (Local Backup)" },
    { id: "fallback-home", name: "Home & Kitchen (Local Backup)" },
  ]);

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
          }
        }
      } catch (err) {
        console.error("Failed to load live database categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // CRITICAL FIX: Capture form element reference instantly before async execution pools wipe 'e.currentTarget'
    const formElement = e.currentTarget;

    const formData = new FormData(formElement);

    // FIX 2: Swap out the old single 'imageUrl' string property extraction.
    // We now feed our state payload array directly into the database API.
    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      stock: formData.get("stock"),
      categoryId: formData.get("categoryId"),
      images: images,
    };

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Execution error");

      setStatus({
        type: "success",
        message: "Product listed securely in repository catalog!",
      });

      // CRITICAL FIX: Safe execution using the explicitly captured element reference variable
      formElement.reset();
      setImages([]); // Clear the uploaded image previews grid on success
      router.refresh();
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link
              href="/dashboard/admin/products"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to inventory
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Create Product
            </h1>
            <p className="text-sm text-neutral-500">
              Configure public descriptions, pricing matrices, and tracking
              stock fields.
            </p>
          </div>
        </div>

        {status && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium transition-all ${
              status.type === "success"
                ? "bg-emerald-50/60 text-emerald-800 border-emerald-200"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {status.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 space-y-6">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-neutral-800 flex items-center gap-1.5">
                <Package className="h-4 w-4 text-neutral-400" /> Title
                Nomenclature
              </label>
              <input
                required
                name="name"
                type="text"
                placeholder="e.g., Hand-Woven Wool Rug"
                className="w-full border border-neutral-200 rounded-lg p-3 text-sm outline-none focus:border-neutral-900 transition-colors bg-neutral-50/30"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-neutral-800">
                Detailed Description
              </label>
              <textarea
                required
                name="description"
                rows={4}
                placeholder="Detail product features, material compositions, or dimensional specifications..."
                className="w-full border border-neutral-200 rounded-lg p-3 text-sm outline-none focus:border-neutral-900 transition-colors bg-neutral-50/30 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-neutral-800 flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-neutral-400" /> Financial
                  Value (USD)
                </label>
                <input
                  required
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border border-neutral-200 rounded-lg p-3 text-sm outline-none focus:border-neutral-900 transition-colors bg-neutral-50/30"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-neutral-800">
                  Available Stock Units
                </label>
                <input
                  required
                  name="stock"
                  type="number"
                  placeholder="0"
                  className="w-full border border-neutral-200 rounded-lg p-3 text-sm outline-none focus:border-neutral-900 transition-colors bg-neutral-50/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-neutral-800 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-neutral-400" /> Structural
                  Category
                </label>
                <div className="relative w-full">
                  <select
                    required
                    name="categoryId"
                    className="w-full border border-neutral-200 rounded-lg p-3 pr-10 text-sm outline-none focus:border-neutral-900 transition-colors bg-neutral-50/30 appearance-none cursor-pointer text-neutral-900"
                  >
                    <option value="" className="text-neutral-500">
                      Select classifications...
                    </option>
                    {categories.map((cat) => (
                      <option
                        key={cat.id || (cat as any)._id}
                        value={cat.id || (cat as any)._id || (cat as any).id}
                        className="text-neutral-900"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neutral-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* FIX 3: Completely replaced the old textual display input slot with our custom Cloudinary Dropzone area */}
              <div className="md:col-span-2 pt-2">
                <ImageUploader
                  value={images}
                  onChange={(urls) => setImages(urls)}
                />
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 border-t border-neutral-200 px-6 py-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-neutral-950 text-neutral-50 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Deploy to Catalog
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
