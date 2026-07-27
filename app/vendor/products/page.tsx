"use client";

import { useState, useEffect } from "react";
import { VendorLayout } from "@/src/components/templates/VendorLayout";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency } from "@/src/lib/utils";
import {
  HiPlus,
  HiMagnifyingGlass,
  HiCube,
  HiXMark,
  HiCheckCircle,
} from "react-icons/hi2";
import type { Product } from "@/src/types";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [category, setCategory] = useState("Handicrafts");
  const [origin, setOrigin] = useState("Tarawa");
  const [description, setDescription] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    api.getProducts({ pageSize: 50 }).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProd: Product = {
      id: `p-${Date.now()}`,
      name,
      price: parseFloat(price),
      currency: "AUD",
      images: ["/favicon.png"],
      category,
      vendorId: "v-1",
      vendorName: "Tebwa Artisans",
      rating: 5.0,
      reviewCount: 0,
      stock: parseInt(stock) || 1,
      status: "pending", // New listings submit for admin approval
      description: description || "Authentic handmade Kiribati handicraft.",
      origin: origin || "Tarawa",
      material: "Natural Fiber",
      createdAt: new Date().toISOString(),
    };

    setProducts([newProd, ...products]);
    setShowAddModal(false);
    setName("");
    setPrice("");
    setDescription("");
    triggerToast("Product submitted! Sent to Admin queue for moderation.");
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <VendorLayout activeTab="products">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-ink">My Products & Inventory</h2>
            <p className="text-xs text-gray-500">Manage your product listings, inventory levels, and submission status.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} leftIcon={<HiPlus className="h-4 w-4" />}>
            Add New Product
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name or category..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-ink placeholder:text-gray-400 focus:border-ink focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "pending", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  statusFilter === st ? "bg-ink text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <HiCube className="mx-auto mb-2 h-10 w-10 text-gray-300" />
              <p className="text-sm">No products found matching filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                    <th className="p-3 font-semibold">Product Name</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Price</th>
                    <th className="p-3 font-semibold">Stock</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Origin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-semibold text-ink">{product.name}</td>
                      <td className="p-3 text-gray-600">{product.category}</td>
                      <td className="p-3 font-semibold text-ink">{formatCurrency(product.price, product.currency)}</td>
                      <td className="p-3 text-gray-600">{product.stock} units</td>
                      <td className="p-3">
                        <Badge
                          variant={
                            product.status === "active"
                              ? "success"
                              : product.status === "pending"
                              ? "warning"
                              : "error"
                          }
                          className="capitalize"
                        >
                          {product.status === "pending" ? "Pending Approval" : product.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-500">{product.origin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAddModal(false)}>
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-lg font-bold text-ink">Add New Product</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-ink">
                  <HiXMark className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Product Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hand-woven Kiribati Mat"
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Price (AUD)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="45.00"
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Stock Units</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="10"
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none bg-white"
                    >
                      <option value="Handicrafts">Handicrafts</option>
                      <option value="Jewelry">Jewelry</option>
                      <option value="Woodwork">Woodwork</option>
                      <option value="Apparel">Apparel</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">Island Origin</label>
                    <input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Tarawa"
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Craft story, materials, and island traditions..."
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                <div className="mt-2 flex justify-end gap-3 border-t border-gray-200 pt-3">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Product</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#222222] px-5 py-3 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-5">
            <HiCheckCircle className="h-5 w-5 text-green-400" />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </VendorLayout>
  );
}
