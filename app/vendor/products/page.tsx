"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency } from "@/src/lib/utils";
import {
  HiPlus,
  HiMagnifyingGlass,
  HiCube,
  HiChevronLeft,
  HiChevronRight,
  HiArrowTopRightOnSquare,
  HiPencilSquare,
} from "react-icons/hi2";
import type { Product } from "@/src/types";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    api.getProducts({ pageSize: 50 }).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  // Filter products based on search & status
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination slice
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (st: string) => {
    setStatusFilter(st);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink">My Products & Inventory</h2>
          <p className="text-xs text-gray-500">Manage your product listings, inventory levels, and submission status.</p>
        </div>
        <Link href="/vendor/products/new">
          <Button leftIcon={<HiPlus className="h-4 w-4" />}>
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search product name or category..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-ink placeholder:text-gray-400 focus:border-ink focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "active", "pending", "draft", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => handleFilterChange(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${statusFilter === st
                ? "bg-ink text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {st === "pending" ? "Pending Approval" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table Container */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
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
          <>
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
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProducts.map((product) => (
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
                                : product.status === "draft"
                                  ? "default"
                                  : "error"
                          }
                          className="capitalize"
                        >
                          {product.status === "pending" ? "Pending Approval" : product.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-500">{product.origin}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/product/${product.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-ink"
                            title="View Public Listing"
                          >
                            <HiArrowTopRightOnSquare className="h-3.5 w-3.5 text-gray-400" />
                            View
                          </Link>
                          <Link
                            href={`/vendor/products/new`}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[#FF385C] hover:bg-red-50"
                            title="Edit Product"
                          >
                            <HiPencilSquare className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  Showing <strong className="text-ink">{startIndex + 1}</strong> to{" "}
                  <strong className="text-ink">{endIndex}</strong> of{" "}
                  <strong className="text-ink">{totalItems}</strong> products
                </span>

                <div className="flex items-center gap-1.5">
                  <span>Per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-md border border-gray-200 bg-white p-1 text-xs font-semibold text-ink focus:border-ink focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              {/* Numbered Page Buttons & Prev/Next Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="mr-2 text-xs"
                >
                  <HiChevronLeft className="h-3.5 w-3.5" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${currentPage === pageNum
                      ? "bg-[#FF385C] text-white shadow-xs"
                      : "bg-white text-gray-700 hover:bg-gray-200/60 border border-gray-200"
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-2 text-xs"
                >
                  <HiChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
