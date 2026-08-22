"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { ErrorState } from "@/src/components/molecules/ErrorState";
import { useOrders } from "@/src/hooks";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import { encodeOrderIdBase256 } from "@/src/lib/security";
import {
  HiClipboardDocumentList,
  HiCheckCircle,
  HiChevronLeft,
  HiChevronRight,
  HiEye,
  HiUser,
  HiMapPin,
} from "react-icons/hi2";
import type { Order } from "@/src/types";

const statusVariants: Record<Order["status"], "default" | "primary" | "success" | "warning" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

export default function VendorOrdersPage() {
  const [localOrders, setLocalOrders] = useState<Order[] | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const ordersQuery = useOrders();
  const fetchedOrders = ordersQuery.data ?? [];
  const orders = localOrders ?? fetchedOrders;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setLocalOrders((prev) =>
      (prev ?? fetchedOrders).map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId.toUpperCase()} status updated to ${newStatus.toUpperCase()}`);
  };

  // Pagination calculations
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-ink">Incoming Orders & Fulfillment</h2>
        <p className="text-xs text-gray-500">Track buyer orders, inspect customer shipping notes, and update fulfillment status.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        {ordersQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : ordersQuery.isError ? (
          <ErrorState
            variant="compact"
            title="Could not load incoming vendor orders"
            description="We ran into a problem retrieving customer orders. Please try again."
            onRetry={() => void ordersQuery.refetch()}
          />
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <HiClipboardDocumentList className="mx-auto mb-2 h-10 w-10 text-gray-300" />
            <p className="text-sm">No orders received yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                    <th className="p-3 font-semibold">Order ID</th>
                    <th className="p-3 font-semibold">Customer</th>
                    <th className="p-3 font-semibold">Island Location</th>
                    <th className="p-3 font-semibold">Items</th>
                    <th className="p-3 font-semibold">Total</th>
                    <th className="p-3 font-semibold">Date</th>
                    <th className="p-3 font-semibold">Fulfillment Status</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentOrders.map((order) => {
                    const token = encodeOrderIdBase256(order.id);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50">
                        <td className="p-3">
                          <Link
                            href={`/vendor/orders/${token}`}
                            className="font-bold text-rausch hover:underline"
                          >
                            {order.id.toUpperCase()}
                          </Link>
                        </td>
                        <td className="p-3">
                          <span className="flex items-center gap-1.5 font-semibold text-ink">
                            <HiUser className="h-4 w-4 text-gray-400" />
                            {order.shippingAddress?.fullName || "John Smith"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <HiMapPin className="h-3.5 w-3.5 text-rausch" />
                            {order.shippingAddress?.city || "Tarawa"}, {order.shippingAddress?.country || "Kiribati"}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">{order.items.length} item(s)</td>
                        <td className="p-3 font-bold text-ink">{formatCurrency(order.total, order.currency)}</td>
                        <td className="p-3 text-gray-500">{formatDate(order.createdAt)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={statusVariants[order.status] || "default"} className="capitalize">
                              {order.status}
                            </Badge>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                              className="rounded-md border border-gray-200 bg-white p-1 text-xs font-semibold text-ink focus:border-ink focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <Link href={`/vendor/orders/${token}`}>
                            <Button variant="outline" size="xs" leftIcon={<HiEye className="h-3.5 w-3.5" />}>
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  Showing <strong className="text-ink">{startIndex + 1}</strong> to{" "}
                  <strong className="text-ink">{endIndex}</strong> of{" "}
                  <strong className="text-ink">{totalItems}</strong> orders
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

              {/* Numbered Page Buttons */}
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
                    className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                      currentPage === pageNum
                        ? "bg-rausch text-white shadow-xs"
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

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-ink px-5 py-3 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-5">
          <HiCheckCircle className="h-5 w-5 text-green-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
