"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/src/components/templates/AdminLayout";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency } from "@/src/lib/utils";
import {
  HiShieldCheck,
  HiCheckCircle,
  HiXCircle,
  HiMagnifyingGlass,
  HiCube,
} from "react-icons/hi2";
import type { Product } from "@/src/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    api.getProducts({ pageSize: 100 }).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const handleApprove = (id: string, name: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "active" } : p))
    );
    showToast(`Approved "${name}" — Listing is now Live on Marketplace!`);
  };

  const handleReject = (id: string, name: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p))
    );
    showToast(`Rejected "${name}" — Listing returned to vendor.`);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout activeTab="products">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <HiShieldCheck className="h-5 w-5 text-red-600" />
            Product Listing Moderation Queue
          </h2>
          <p className="text-xs text-gray-500">Review, approve, or reject vendor handicraft submissions before they go live.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, vendor, or category..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-ink placeholder:text-gray-400 focus:border-red-600 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "active", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  statusFilter === st ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Moderation Table */}
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
                    <th className="p-3 font-semibold">Product</th>
                    <th className="p-3 font-semibold">Vendor / Artisan</th>
                    <th className="p-3 font-semibold">Price</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50">
                      <td className="p-3">
                        <p className="font-semibold text-ink">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category} • {product.origin}</p>
                      </td>
                      <td className="p-3 text-gray-700 font-medium">{product.vendorName}</td>
                      <td className="p-3 font-semibold text-ink">{formatCurrency(product.price, product.currency)}</td>
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
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-xs py-1 px-2.5"
                            onClick={() => handleApprove(product.id, product.name)}
                            disabled={product.status === "active"}
                            leftIcon={<HiCheckCircle className="h-4 w-4" />}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 text-xs py-1 px-2.5"
                            onClick={() => handleReject(product.id, product.name)}
                            disabled={product.status === "rejected"}
                            leftIcon={<HiXCircle className="h-4 w-4" />}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#222222] px-5 py-3 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-5">
            <HiCheckCircle className="h-5 w-5 text-green-400" />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
