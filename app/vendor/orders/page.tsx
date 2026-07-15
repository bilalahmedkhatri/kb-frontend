"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/src/store/authStore";
import { VendorLayout } from "@/src/components/templates/VendorLayout";
import { Badge } from "@/src/components/atoms/Badge";
import { Pagination } from "@/src/components/atoms/Pagination";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import { HiClipboardDocumentList } from "react-icons/hi2";
import type { Order } from "@/src/types";

const statusOptions = ["pending", "confirmed", "shipped", "delivered"] as const;
const statusVariant: Record<string, "warning" | "primary" | "success" | "default" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const PAGE_SIZE = 10;

export default function VendorOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus as Order["status"], updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <VendorLayout activeTab="orders">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#222222]">Orders</h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
            <HiClipboardDocumentList className="mb-3 h-12 w-12 text-[#DDDDDD]" />
            <p className="text-base font-medium text-[#717171]">No orders yet</p>
            <p className="text-sm text-[#717171]">Orders will appear here when customers purchase your products.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#DDDDDD] text-[#717171]">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => {
                    const customerName = order.shippingAddress.fullName;
                    const currentIdx = statusOptions.indexOf(
                      order.status as typeof statusOptions[number]
                    );

                    return (
                      <tr key={order.id} className="border-b border-[#DDDDDD]">
                        <td className="py-3 font-semibold text-[#222222]">
                          {order.id.toUpperCase()}
                        </td>
                        <td className="py-3 text-[#717171]">{customerName}</td>
                        <td className="py-3 text-[#717171]">{order.items.length}</td>
                        <td className="py-3 text-[#222222]">
                          {formatCurrency(order.total, order.currency)}
                        </td>
                        <td className="py-3 text-[#717171]">{formatDate(order.createdAt)}</td>
                        <td className="py-3">
                          {order.status === "cancelled" ? (
                            <Badge variant="error">Cancelled</Badge>
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${
                                order.status === "pending"
                                  ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                                  : order.status === "confirmed"
                                  ? "border-blue-200 bg-blue-50 text-blue-800"
                                  : order.status === "shipped"
                                  ? "border-blue-200 bg-blue-50 text-blue-800"
                                  : "border-green-200 bg-green-50 text-green-800"
                              }`}
                            >
                              {statusOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </VendorLayout>
  );
}
