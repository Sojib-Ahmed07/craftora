// src/app/dashboard/admin/products/[id]/edit/edit-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
}

interface EditProductFormProps {
  initialProduct: any;
  categories: Category[];
}

export function EditProductForm({
  initialProduct,
  categories,
}: EditProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State Management matrix
  const [formData, setFormData] = useState({
    name: initialProduct.name || "",
    slug: initialProduct.slug || "",
    description: initialProduct.description || "",
    price: Number(initialProduct.price).toString(),
    stock: initialProduct.stock.toString(),
    categoryId: initialProduct.categoryId || "",
    imageUrl: initialProduct.images?.[0] || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-generate URL slugs dynamically if editing the name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameVal = e.target.value;
    const slugVal = nameVal
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      slug: slugVal,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${initialProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          categoryId: formData.categoryId,
          images: formData.imageUrl ? [formData.imageUrl] : [],
        }),
      });

      if (res.ok) {
        router.push("/dashboard/admin/products");
        router.refresh(); // Tells Next.js to drop cached layout assets data blocks
      } else {
        alert("Failed to submit product updates.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      {/* Product Name Input */}
      <div className="space-y-1.5">
        <label className="font-semibold text-neutral-700">Product Name</label>
        <input
          type="text"
          required
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-neutral-900 transition-colors font-medium text-neutral-900"
        />
      </div>

      {/* URL Slug Metric Representation */}
      <div className="space-y-1.5">
        <label className="font-semibold text-neutral-500 flex items-center gap-1">
          URL Slug{" "}
          <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.2 rounded font-mono">
            Auto-generated
          </span>
        </label>
        <input
          type="text"
          required
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 bg-neutral-50 text-neutral-500 cursor-not-allowed font-mono text-xs"
          readOnly
        />
      </div>

      {/* Category Dropdown Selector */}
      <div className="space-y-1.5">
        <label className="font-semibold text-neutral-700">
          Category Tag Allocation
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-neutral-900 transition-colors font-medium text-neutral-900"
        >
          <option value="">Select a product category...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid for Price and Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-semibold text-neutral-700">
            Price ($ USD)
          </label>
          <input
            type="number"
            step="0.01"
            required
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-neutral-900 transition-colors font-medium text-neutral-900"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-semibold text-neutral-700">Stock Units</label>
          <input
            type="number"
            required
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-neutral-900 transition-colors font-medium text-neutral-900"
          />
        </div>
      </div>

      {/* Product Image URL Input */}
      <div className="space-y-1.5">
        <label className="font-semibold text-neutral-700">
          Image Asset URL
        </label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/..."
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-neutral-900 transition-colors font-medium text-neutral-900 placeholder:text-neutral-300"
        />
      </div>

      {/* Description Textarea Field */}
      <div className="space-y-1.5">
        <label className="font-semibold text-neutral-700">
          Detailed Overview
        </label>
        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-neutral-900 transition-colors font-medium text-neutral-900 leading-relaxed"
        />
      </div>

      {/* Form Submission Execution Actions */}
      <div className="pt-3">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl text-sm font-semibold tracking-wide gap-2 shadow-sm cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Commit Full Updates
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
