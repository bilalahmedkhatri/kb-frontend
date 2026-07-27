"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { VendorLayout } from "@/src/components/templates/VendorLayout";
import { useAuthStore } from "@/src/store/authStore";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import {
  HiBuildingStorefront,
  HiClipboardDocumentList,
  HiCube,
  HiChatBubbleLeftRight,
  HiEye,
  HiPlus,
} from "react-icons/hi2";
import type { Order } from "@/src/types";

const statCards = [
  { key: "sales", label: "Total Sales", icon: HiBuildingStorefront, value: "$12,450" },
  { key: "orders", label: "Total Orders", icon: HiClipboardDocumentList, value: "48" },
  { key: "products", label: "Active Products", icon: HiCube, value: "18" },
  { key: "reviews", label: "Pending Reviews", icon: HiChatBubbleLeftRight, value: "3" },
];

const statusVariant: Record<string, "warning" | "primary" | "success" | "default" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

export default function VendorDashboardPage() {
  const { user } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartValues] = useState([65, 40, 80, 55, 90, 70, 85]);

  useEffect(() => {
    api.getOrders().then((data) => {
      setRecentOrders(data.slice(0, 5));
      setLoading(false);
    });
  }, []);

  return (
    <VendorLayout activeTab="dashboard">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#222222]">
            Welcome back, {user?.name?.split(" ")[0] || "Vendor"}
          </h2>
          <div className="flex gap-2">
            <Link href="/vendor/products">
              <Button size="sm" leftIcon={<HiPlus className="h-4 w-4" />}>
                Add Product
              </Button>
            </Link>
            <Link href="/vendor/store-settings">
              <Button variant="outline" size="sm">
                Store Settings
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-[#FF385C]" />
                  <span className="text-xs font-medium text-gray-500">{stat.label}</span>
                </div>
                <span className="text-2xl font-bold text-ink">{stat.value}</span>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-ink">Sales Overview (Last 7 Days)</h3>
          <div className="flex items-end gap-3" style={{ height: 120 }}>
            {chartValues.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-[#FF385C] transition-all hover:bg-[#E31C5F]"
                  style={{ height: `${v}%` }}
                />
                <span className="text-[11px] font-medium text-gray-500">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Recent Incoming Orders</h3>
            <Link href="/vendor/orders" className="text-xs font-semibold text-[#FF385C] hover:underline">
              View All Orders →
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 font-semibold text-ink">{order.id.toUpperCase()}</td>
                      <td className="py-3 text-gray-600">{order.items.length} item(s)</td>
                      <td className="py-3 font-semibold text-ink">{formatCurrency(order.total, order.currency)}</td>
                      <td className="py-3">
                        <Badge variant={statusVariant[order.status] || "default"}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </VendorLayout>
  );
}
