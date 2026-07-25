"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/src/components/atoms/Badge";
import { Spinner } from "@/src/components/atoms/Spinner";
import { api } from "@/src/lib/api";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import {
  HiUserGroup,
  HiCube,
  HiHome,
  HiClipboardDocumentList,
  HiBuildingStorefront,
} from "react-icons/hi2";
import type { Order, User, Product } from "@/src/types";

const statusVariant: Record<string, "warning" | "primary" | "success" | "default" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getOrders(),
      api.getProducts({ pageSize: 100 }),
    ]).then(([orderData, productData]) => {
      setOrders(orderData);
      setAllProducts(productData.data);
      setLoading(false);
    });
  }, []);

  const totalVendors = 8;
  const totalStays = 16;
  const totalUsers = 9;

  const recentOrders = orders.slice(0, 5);
  const recentVendors: User[] = [
    { id: "v-1", email: "maria@tebwa.shop", name: "Maria Tebwa", avatar: "", role: "vendor", location: "Tarawa", createdAt: "2024-01-15" },
    { id: "v-2", email: "tione@karanga.art", name: "Tione Karanga", avatar: "", role: "vendor", location: "Kiritimati", createdAt: "2024-02-20" },
    { id: "v-3", email: "nei@reraweaves.fi", name: "Nei Reraweaves", avatar: "", role: "vendor", location: "Abaiang", createdAt: "2024-03-10" },
    { id: "v-4", email: "tabwai@pottery.ki", name: "Tabwai Pottery", avatar: "", role: "vendor", location: "Beru", createdAt: "2024-04-05" },
    { id: "v-5", email: "anere@homestay.ki", name: "Anere Homestays", avatar: "", role: "vendor", location: "Tarawa", createdAt: "2023-11-01" },
  ];

  const stats = [
    { label: "Total Users", value: totalUsers, icon: HiUserGroup, color: "text-blue-500" },
    { label: "Total Products", value: allProducts.length, icon: HiCube, color: "text-green-500" },
    { label: "Total Stays", value: totalStays, icon: HiHome, color: "text-purple-500" },
    { label: "Total Orders", value: orders.length, icon: HiClipboardDocumentList, color: "text-[#FF385C]" },
  ];

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
      <h1 className="mb-6 text-2xl font-bold text-[#222222]">Admin Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[#DDDDDD] p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-xs font-medium text-[#717171]">{stat.label}</span>
              </div>
              <span className="text-2xl font-bold text-[#222222]">{stat.value}</span>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-[#222222]">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#DDDDDD] text-[#717171]">
                <th className="pb-2 font-medium">Order ID</th>
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
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-[#222222]">Recent Vendors</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="flex items-start gap-3 rounded-xl border border-[#DDDDDD] p-4"
            >
              <HiBuildingStorefront className="mt-0.5 h-8 w-8 flex-shrink-0 text-[#717171]" />
              <div>
                <p className="text-sm font-semibold text-[#222222]">{vendor.name}</p>
                <p className="text-xs text-[#717171]">{vendor.email}</p>
                <p className="text-xs text-[#717171]">{vendor.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/products"
          className="text-sm font-medium text-[#FF385C] hover:underline"
        >
          Moderate Products →
        </Link>
        <Link
          href="/admin/vendors"
          className="text-sm font-medium text-[#FF385C] hover:underline"
        >
          Manage Vendors →
        </Link>
        <Link
          href="/admin/settings"
          className="text-sm font-medium text-[#FF385C] hover:underline font-bold"
        >
          Platform Settings & Monetization →
        </Link>
      </div>
    </div>
  );
}
