import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Plus,
  Package,
  AlertTriangle,
  Eye,
  ShoppingBag,
  Folder,
} from "lucide-react";

async function getInventory() {
  try {
    return await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getInventory();

  const totalItems = products.length;
  const totalValue = products.reduce(
    (acc, item) => acc + Number(item.price) * item.stock,
    0,
  );
  const lowStock = products.filter((item) => item.stock <= 5).length;

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
              catalog.
            </p>
          </div>
          <Link
            href="/dashboard/admin/add-product"
            className="inline-flex items-center gap-2 bg-neutral-950 text-neutral-50 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>

        {/* Analytic Cards Grid */}
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

        {/* Data Table Panel */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Package className="h-10 w-10 text-neutral-300 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-900">
                No products found
              </h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Get started by creating your first ecommerce catalog item using
                the upload engine.
              </p>
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
                  {products.map((product) => (
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
                      <td className="p-4 font-semibold text-neutral-900">
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${product.stock === 0 ? "bg-rose-500" : product.stock <= 5 ? "bg-amber-500" : "bg-emerald-500"}`}
                          />
                          <span className="font-medium text-neutral-900">
                            {product.stock} units
                          </span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="inline-flex items-center justify-center h-8 w-8 text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all shadow-sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
