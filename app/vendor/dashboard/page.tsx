"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-bold text-[#222222]">
          Welcome back, {user?.name?.split(" ")[0] || "Vendor"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="rounded-xl border border-[#DDDDDD] p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-[#FF385C]" />
                  <span className="text-xs font-medium text-[#717171]">{stat.label}</span>
                </div>
                <span className="text-2xl font-bold text-[#222222]">{stat.value}</span>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-[#DDDDDD] p-4">
          <h3 className="mb-4 text-sm font-semibold text-[#222222]">Sales Overview (7 days)</h3>
          <div className="flex items-end gap-2" style={{ height: 100 }}>
            {chartValues.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-[#FF385C] transition-all"
                  style={{ height: `${v}%` }}
                />
                <span className="text-[10px] text-[#717171]">D{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-[#222222]">Recent Orders</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-[#717171]">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#DDDDDD] text-[#717171]">
                    <th className="pb-2 font-medium">Order</th>
                    <th className="pb-2 font-medium">Items</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#DDDDDD]">
                      <td className="py-3 font-semibold text-[#222222]">{order.id.toUpperCase()}</td>
                      <td className="py-3 text-[#717171]">{order.items.length}</td>
                      <td className="py-3 text-[#222222]">{formatCurrency(order.total, order.currency)}</td>
                      <td className="py-3">
                        <Badge variant={statusVariant[order.status] || "default"}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 text-[#717171]">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link href="/vendor/products">
            <Button size="sm" leftIcon={<HiCube className="h-4 w-4" />}>
              Add Product
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" leftIcon={<HiEye className="h-4 w-4" />}>
              View Store
            </Button>
          </Link>
          <Link href="/vendor/store-settings">
            <Button variant="ghost" size="sm">
              Update Settings
            </Button>
          </Link>
        </div>
      </div>
  );
}
