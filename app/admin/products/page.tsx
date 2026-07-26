"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency, cn } from "@/src/lib/utils";
import { HiCheck, HiXMark, HiCube } from "react-icons/hi2";
import type { Product } from "@/src/types";

const statusTabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "rejected", label: "Rejected" },
] as const;

const statusVariant: Record<string, "success" | "warning" | "error"> = {
  active: "success",
  pending: "warning",
  rejected: "error",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    api.getProducts({ pageSize: 100 }).then((data) => {
      setProducts(data.data);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = (id: string, status: "active" | "rejected") => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const filtered =
    filter === "all"
      ? products
      : products.filter((p) => p.status === filter);

  if (loading) {
    return (
      <div className="container-app py-8">
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#222222]">Product Moderation</h1>

      <div className="mb-6 flex gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              filter === tab.key
                ? "bg-[#222222] text-white"
                : "bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
          <HiCube className="mb-3 h-12 w-12 text-[#DDDDDD]" />
          <p className="text-base font-medium text-[#717171]">No products found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#DDDDDD] text-[#717171]">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Vendor</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-[#DDDDDD]">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-[#222222]">{product.name}</p>
                        <p className="text-xs text-[#717171]">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-[#717171]">{product.vendorName}</td>
                  <td className="py-3 text-[#222222]">{formatCurrency(product.price, product.currency)}</td>
                  <td className="py-3">
                    <Badge variant={statusVariant[product.status]}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3">
                    {product.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(product.id, "active")}
                          className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100"
                        >
                          <HiCheck className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(product.id, "rejected")}
                          className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
                        >
                          <HiXMark className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#717171]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
