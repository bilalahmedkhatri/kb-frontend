"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/src/store/authStore";
import { AccountLayout } from "@/src/components/templates/AccountLayout";
import { Badge } from "@/src/components/atoms/Badge";
import { Pagination } from "@/src/components/atoms/Pagination";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import { HiShoppingBag } from "react-icons/hi2";
import type { Order } from "@/src/types";

const statusVariant: Record<string, "warning" | "primary" | "success" | "default" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getOrders(user.id).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [user]);

  if (!user) {
    return (
      <AccountLayout activeTab="orders">
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[#717171]">Please sign in to view your orders.</p>
        </div>
      </AccountLayout>
    );
  }

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AccountLayout activeTab="orders">
      <h2 className="mb-4 text-lg font-bold text-[#222222]">Order History</h2>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDDDDD] py-16">
          <HiShoppingBag className="mb-3 h-12 w-12 text-[#DDDDDD]" />
          <p className="text-base font-medium text-[#717171]">No orders yet</p>
          <p className="text-sm text-[#717171]">Start shopping to see your orders here.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {paginatedOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between rounded-xl border border-[#DDDDDD] p-4 transition-colors hover:border-[#222222]"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-[#222222]">{order.id.toUpperCase()}</span>
                  <span className="text-xs text-[#717171]">{formatDate(order.createdAt)}</span>
                  <span className="text-xs text-[#717171]">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-[#222222]">{formatCurrency(order.total, order.currency)}</span>
                  <Badge variant={statusVariant[order.status] || "default"}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-6"
          />
        </>
      )}
    </AccountLayout>
  );
}
