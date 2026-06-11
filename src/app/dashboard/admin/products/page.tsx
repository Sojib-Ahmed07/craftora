"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Plus,
  Package,
  AlertTriangle,
  Eye,
  ShoppingBag,
  Folder,
  Trash2,
  Check,
  X,
  Loader2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  slug: string;
  images: string[];
  category?: Category | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Editing state trackers
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editStock, setEditStock] = useState<string>("");
  const [isMutating, setIsMutating] = useState<boolean>(false);

  // Safely synchronize inventory data fetching via mount protection guard rules
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (isMounted && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error("FAILED_TO_LOAD_INVENTORY:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handler to open inline editor
  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditPrice(Number(product.price).toString());
    setEditStock(product.stock.toString());
  };

  // Handler to submit updating inline values
  const handleUpdate = async (id: string) => {
    setIsMutating(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: editPrice,
          stock: editStock,
        }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  price: parseFloat(editPrice),
                  stock: parseInt(editStock, 10),
                }
              : p,
          ),
        );
        setEditingId(null);
      } else {
        alert("Failed to update product settings.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsMutating(false);
    }
  };

  // Handler to fire delete network request rules
  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you absolutely sure you want to completely purge "${name}"?`,
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product asset.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculated metrics summaries
  const totalItems = products.length;
  const totalValue = products.reduce(
    (acc, item) => acc + Number(item.price) * item.stock,
    0,
  );
  const lowStock = products.filter((item) => item.stock <= 5).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50/50">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Action Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Inventory Core
            </h1>
            <p className="text-sm text-neutral-500">
              Monitor active items, review storage allocations, and update your
              catalog details.
            </p>
          </div>
          <Link
            href="/dashboard/admin/products/add"
            className="inline-flex items-center gap-2 bg-neutral-950 text-neutral-50 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-neutral-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-neutral-100 text-neutral-700 rounded-lg">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Total Catalog Items
              </p>
              <h3 className="text-2xl font-bold text-neutral-900">
                {totalItems}
              </h3>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Estimated Vault Assets
              </p>
              <h3 className="text-2xl font-bold text-neutral-900">
                $
                {totalValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Critical Low Stock
              </p>
              <h3 className="text-2xl font-bold text-neutral-900">
                {lowStock}
              </h3>
            </div>
          </div>
        </div>

        {/* Dynamic Data Table Area */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Package className="h-10 w-10 text-neutral-300 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-900">
                No products found
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/70 border-b border-neutral-200 text-xs font-semibold uppercase text-neutral-500 tracking-wider">
                    <th className="p-4 pl-6">Product Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock Allocation</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm text-neutral-700">
                  {products.map((product) => {
                    const isEditing = editingId === product.id;

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-neutral-50/40 transition-colors"
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt=""
                                className="h-10 w-10 rounded-lg object-cover border border-neutral-200/60 bg-neutral-50"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200/40">
                                <Package className="h-4 w-4" />
                              </div>
                            )}
                            <div className="max-w-[240px]">
                              <h4 className="font-semibold text-neutral-900 truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs text-neutral-400 truncate">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-xs bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full font-medium">
                            <Folder className="h-3 w-3 text-neutral-400" />{" "}
                            {product.category?.name || "Unassigned"}
                          </span>
                        </td>

                        {/* Price Cell Input Field Row */}
                        <td className="p-4 font-semibold text-neutral-900">
                          {isEditing ? (
                            <div className="flex items-center gap-1 max-w-[90px] border border-neutral-300 rounded-md px-1.5 py-1 bg-white">
                              <span className="text-neutral-400 text-xs">
                                $
                              </span>
                              <input
                                type="number"
                                className="w-full bg-transparent focus:outline-none text-sm font-medium"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                              />
                            </div>
                          ) : (
                            `$${Number(product.price).toFixed(2)}`
                          )}
                        </td>

                        {/* Inventory Count Stock Allocation Cell Wrapper */}
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="number"
                              className="w-20 border border-neutral-300 rounded-md px-2 py-1 bg-white focus:outline-none text-sm font-medium"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${product.stock === 0 ? "bg-rose-500" : product.stock <= 5 ? "bg-amber-500" : "bg-emerald-500"}`}
                              />
                              <span className="font-medium text-neutral-900">
                                {product.stock} units
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Action Operations Column block */}
                        <td className="p-4 pr-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                  disabled={isMutating}
                                  onClick={() => handleUpdate(product.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 text-neutral-400 hover:bg-neutral-100"
                                  disabled={isMutating}
                                  onClick={() => setEditingId(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs font-semibold px-2.5 rounded-lg"
                                  onClick={() => startEditing(product)}
                                >
                                  Quick Edit
                                </Button>
                                <Link
                                  href={`/dashboard/admin/products/${product.id}/edit`}
                                  className="inline-flex items-center justify-center h-8 text-xs font-semibold px-2.5 text-neutral-700 border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all shadow-sm gap-1"
                                >
                                  <Pencil className="h-3 w-3 text-neutral-400" />{" "}
                                  Edit Details
                                </Link>
                                <Link
                                  href={`/products/${product.slug}`}
                                  target="_blank"
                                  className="inline-flex items-center justify-center h-8 w-8 text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all shadow-sm"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 text-rose-500 border-neutral-200 hover:bg-rose-50 hover:text-rose-600"
                                  onClick={() =>
                                    handleDelete(product.id, product.name)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
