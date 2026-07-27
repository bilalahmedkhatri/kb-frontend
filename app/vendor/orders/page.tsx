"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/src/components/atoms/Badge";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import { HiClipboardDocumentList, HiCheckCircle } from "react-icons/hi2";
import type { Order } from "@/src/types";

const statusVariants: Record<Order["status"], "default" | "primary" | "success" | "warning" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    api.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId.toUpperCase()} status updated to ${newStatus.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-ink">Incoming Orders & Fulfillment</h2>
        <p className="text-xs text-gray-500">Track incoming buyer orders and update shipment status.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <HiClipboardDocumentList className="mx-auto mb-2 h-10 w-10 text-gray-300" />
            <p className="text-sm">No orders received yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                  <th className="p-3 font-semibold">Order ID</th>
                  <th className="p-3 font-semibold">Customer</th>
                  <th className="p-3 font-semibold">Items</th>
                  <th className="p-3 font-semibold">Total</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Current Status</th>
                  <th className="p-3 font-semibold">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-ink">{order.id.toUpperCase()}</td>
                    <td className="p-3 text-gray-700 font-medium">{order.shippingAddress.fullName}</td>
                    <td className="p-3 text-gray-600">{order.items.length} item(s)</td>
                    <td className="p-3 font-semibold text-ink">{formatCurrency(order.total, order.currency)}</td>
                    <td className="p-3 text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="p-3">
                      <Badge variant={statusVariants[order.status] || "default"} className="capitalize">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                        className="rounded-lg border border-gray-200 bg-white p-1.5 text-xs font-semibold text-ink focus:border-ink focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
  );
}
