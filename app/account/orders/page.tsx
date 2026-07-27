"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { useCartStore } from "@/src/store/cartStore";
import { Pagination } from "@/src/components/atoms/Pagination";
import { Spinner } from "@/src/components/atoms/Spinner";
import { OrderCard } from "@/src/components/molecules/OrderCard";
import { OrderStatusStepper } from "@/src/components/molecules/OrderStatusStepper";
import { api } from "@/src/lib/api";
import { encodeOrderIdBase256 } from "@/src/lib/security";
import { cn } from "@/src/lib/utils";
import {
  HiShoppingBag,
  HiMagnifyingGlass,
  HiXMark,
} from "react-icons/hi2";
import type { Order } from "@/src/types";

const STATUS_FILTERS = ["All", "Processing", "Shipped", "Delivered", "Returned"] as const;
const PAGE_SIZE = 10;

function TrackingModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Shipment Tracking</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-ink">
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Order <span className="font-semibold text-ink">#{order.id.toUpperCase()}</span>
        </p>

        <OrderStatusStepper currentStatus={order.status} className="border-0 p-0 shadow-none" />
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    api.getOrders(user.id).then((data) => {
      if (!cancelled) {
        setOrders(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Processing" && (o.status === "pending" || o.status === "confirmed")) ||
      (statusFilter === "Shipped" && o.status === "shipped") ||
      (statusFilter === "Delivered" && o.status === "delivered") ||
      (statusFilter === "Returned" && o.status === "cancelled");
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedOrders = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleViewOrderDetails = (order: Order) => {
    const token = encodeOrderIdBase256(order.id);
    router.push(`/account/orders/${token}`);
  };

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-ink">Order History</h2>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:pb-4">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by Order ID or product..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-gray-500 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setStatusFilter(f); setPage(1); }}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 mb-4 py-2 text-sm font-medium transition-colors",
                statusFilter === f
                  ? "bg-ink text-white"
                  : "bg-gray-100 text-gray-500 hover:text-ink"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16">
          <HiShoppingBag className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-base font-medium text-gray-500">
            {search || statusFilter !== "All" ? "No orders match your search" : "No orders yet"}
          </p>
          <p className="text-sm text-gray-500">
            {search || statusFilter !== "All" ? "Try different search terms or filters." : "Start shopping to see your orders here."}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {paginatedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => handleViewOrderDetails(order)}
                onReorder={() => {
                  order.items.forEach((item) =>
                    addItem({
                      id: item.productId,
                      type: "product",
                      name: item.productName,
                      price: item.price,
                      quantity: item.quantity,
                      image: item.productImage,
                    })
                  );
                }}
              />
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
        </>
      )}

      {trackingOrder && <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}
    </>
  );
}