"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/src/store/authStore";
import { useCartStore } from "@/src/store/cartStore";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Pagination } from "@/src/components/atoms/Pagination";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency, formatDate, cn } from "@/src/lib/utils";
import {
  HiShoppingBag,
  HiMagnifyingGlass,
  HiTruck,
  HiDocumentArrowDown,
  HiStar,
  HiArrowPathRoundedSquare,
  HiXMark,
  HiCheckCircle,
} from "react-icons/hi2";
import type { Order } from "@/src/types";

const statusVariant: Record<string, "warning" | "primary" | "success" | "default" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const STATUS_FILTERS = ["All", "Processing", "Shipped", "Delivered", "Returned"] as const;
const PAGE_SIZE = 10;

const TRACKING_STEPS = [
  { label: "Processing", desc: "Order confirmed and being prepared", completed: true },
  { label: "Shipped from Tarawa", desc: "Package has left Kiribati", completed: true },
  { label: "In Transit", desc: "Package is en route to destination", completed: false },
  { label: "Delivered", desc: "Package has been delivered", completed: false },
];

function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#222222]">Order #{order.id.toUpperCase()}</h3>
          <button onClick={onClose} className="text-[#717171] hover:text-[#222222]">
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-[#717171]">{formatDate(order.createdAt)}</span>
          <Badge variant={statusVariant[order.status] || "default"}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="mb-4 space-y-3">
          <h4 className="text-sm font-semibold text-[#222222]">Items</h4>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-[#F7F7F7] p-3">
              <Image src={item.productImage || "/placeholder.svg"} alt={item.productName} width={56} height={56} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#222222]">{item.productName}</p>
                <p className="text-xs text-[#717171]">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-[#222222]">{formatCurrency(item.price * item.quantity, "USD")}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-[#DDDDDD] pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-[#717171]">Subtotal</span>
            <span className="text-[#222222]">{formatCurrency(order.total, "USD")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#717171]">Shipping</span>
            <span className="text-[#222222]">{formatCurrency(0, "USD")}</span>
          </div>
          <div className="flex justify-between border-t border-[#DDDDDD] pt-2 text-sm font-bold">
            <span className="text-[#222222]">Total</span>
            <span className="text-[#222222]">{formatCurrency(order.total, "USD")}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-[#DDDDDD] pt-4">
          <h4 className="text-sm font-semibold text-[#222222]">Shipping Address</h4>
          <p className="text-sm text-[#717171]">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-[#717171]">{order.shippingAddress.street}</p>
          <p className="text-sm text-[#717171]">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
          <p className="text-sm text-[#717171]">{order.shippingAddress.country}</p>
        </div>
      </div>
    </div>
  );
}

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
        className="w-full max-w-md rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#222222]">Shipment Tracking</h3>
          <button onClick={onClose} className="text-[#717171] hover:text-[#222222]">
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-sm text-[#717171]">
          Order <span className="font-semibold text-[#222222]">#{order.id.toUpperCase()}</span>
        </p>

        <div className="relative space-y-0">
          {TRACKING_STEPS.map((step, i) => (
            <div key={step.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                    step.completed ? "bg-green-100 text-green-700" : "bg-[#F7F7F7] text-[#BBBBBB]"
                  )}
                >
                  {step.completed ? <HiCheckCircle className="h-5 w-5 text-green-600" /> : i + 1}
                </div>
                {i < TRACKING_STEPS.length - 1 && (
                  <div className={cn("h-10 w-0.5", step.completed ? "bg-green-200" : "bg-[#DDDDDD]")} />
                )}
              </div>
              <div className={cn("pb-10", i === TRACKING_STEPS.length - 1 && "pb-0")}>
                <p className={cn("text-sm font-medium", step.completed ? "text-[#222222]" : "text-[#BBBBBB]")}>
                  {step.label}
                </p>
                <p className={cn("text-xs", step.completed ? "text-[#717171]" : "text-[#BBBBBB]")}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getOrders(user.id).then((data) => {
      setOrders(data);
      setLoading(false);
    });
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

  const getStatusLabel = (status: string) => {
    if (status === "pending") return "Processing";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-[#222222]">Order History</h2>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by Order ID or product..."
            className="w-full rounded-lg border border-[#DDDDDD] bg-white py-2.5 pl-10 pr-4 text-sm text-[#222222] placeholder:text-[#717171] focus:border-[#222222] focus:outline-none focus:ring-1 focus:ring-[#222222]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setStatusFilter(f); setPage(1); }}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                statusFilter === f
                  ? "bg-[#222222] text-white"
                  : "bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
          <HiShoppingBag className="mb-3 h-12 w-12 text-[#DDDDDD]" />
          <p className="text-base font-medium text-[#717171]">
            {search || statusFilter !== "All" ? "No orders match your search" : "No orders yet"}
          </p>
          <p className="text-sm text-[#717171]">
            {search || statusFilter !== "All" ? "Try different search terms or filters." : "Start shopping to see your orders here."}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {paginatedOrders.map((order) => (
              <div key={order.id} className="rounded-xl border border-[#DDDDDD] p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => setDetailOrder(order)}
                    className="flex items-center gap-3 hover:opacity-70"
                  >
                    <span className="text-sm font-bold text-[#222222]">#{order.id.toUpperCase()}</span>
                    <span className="text-xs text-[#717171]">{formatDate(order.createdAt)}</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#222222]">{formatCurrency(order.total, order.currency)}</span>
                    <Badge variant={statusVariant[order.status] || "default"}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-[#F7F7F7] p-3">
                      <Image
                        src={item.productImage || "/placeholder.svg"}
                        alt={item.productName}
                        width={48}
                        height={48}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-[#222222]">{item.productName}</p>
                        <p className="text-xs text-[#717171]">Qty: {item.quantity} &times; {formatCurrency(item.price, order.currency)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-2 border-t border-[#DDDDDD] pt-3">
                  <Button size="sm" variant="outline" leftIcon={<HiTruck className="h-3.5 w-3.5" />} onClick={() => setTrackingOrder(order)}>
                    Track Package
                  </Button>
                  <Button size="sm" variant="ghost" leftIcon={<HiDocumentArrowDown className="h-3.5 w-3.5" />}>
                    Download Invoice
                  </Button>
                  <Button size="sm" variant="ghost" leftIcon={<HiStar className="h-3.5 w-3.5" />}>
                    Leave Review
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<HiArrowPathRoundedSquare className="h-3.5 w-3.5" />}
                    onClick={() => {
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
                  >
                    Reorder
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
        </>
      )}

      {detailOrder && <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />}
      {trackingOrder && <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}
    </>
  );
}