"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/src/components/templates/AdminLayout";
import { Badge } from "@/src/components/atoms/Badge";
import { Spinner } from "@/src/components/atoms/Spinner";
import { ErrorState } from "@/src/components/molecules/ErrorState";
import { useOrders, useProducts } from "@/src/hooks";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import {
  HiUserGroup,
  HiCube,
  HiHome,
  HiClipboardDocumentList,
  HiBuildingStorefront,
  HiShieldCheck,
} from "react-icons/hi2";
import type { User } from "@/src/types";

const statusVariant: Record<string, "warning" | "primary" | "success" | "default" | "error"> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

export default function AdminDashboardPage() {
  const ordersQuery = useOrders();
  const productsQuery = useProducts({ pageSize: 100 });

  const orders = ordersQuery.data ?? [];
  const allProducts = productsQuery.data?.data ?? [];
  const loading = ordersQuery.isLoading || productsQuery.isLoading;

  const totalStays = 16;
  const totalUsers = 9;
  const pendingModerationCount = allProducts.filter((p) => p.status === "pending").length;

  const recentOrders = orders.slice(0, 5);
  const recentVendors: User[] = [
    { id: "v-1", email: "maria@tebwa.shop", name: "Maria Tebwa", avatar: "", role: "vendor", location: "Tarawa", createdAt: "2024-01-15" },
    { id: "v-2", email: "tione@karanga.art", name: "Tione Karanga", avatar: "", role: "vendor", location: "Kiritimati", createdAt: "2024-02-20" },
    { id: "v-3", email: "nei@reraweaves.fi", name: "Nei Reraweaves", avatar: "", role: "vendor", location: "Abaiang", createdAt: "2024-03-10" },
    { id: "v-4", email: "tabwai@pottery.ki", name: "Tabwai Pottery", avatar: "", role: "vendor", location: "Beru", createdAt: "2024-04-05" },
  ];

  const stats = [
    { label: "Total Platform Users", value: totalUsers, icon: HiUserGroup, color: "text-gray-500" },
    { label: "Total Products", value: allProducts.length, icon: HiCube, color: "text-gray-500" },
    { label: "Total Island Stays", value: totalStays, icon: HiHome, color: "text-gray-500" },
    { label: "Total Platform Orders", value: orders.length, icon: HiClipboardDocumentList, color: "text-gray-500" },
  ];

  return (
    <AdminLayout activeTab="dashboard">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">Platform Executive Summary</h2>
          {pendingModerationCount > 0 && (
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-700 border border-amber-200 hover:bg-amber-100"
            >
              <HiShieldCheck className="h-4 w-4" />
              {pendingModerationCount} Listing(s) Pending Moderation Review →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : ordersQuery.isError || productsQuery.isError ? (
          <ErrorState
            title="Could not load platform summary"
            description="We ran into a problem fetching the platform overview statistics. Please try again."
            onRetry={() => {
              void ordersQuery.refetch();
              void productsQuery.refetch();
            }}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                      <span className="text-xs font-medium text-gray-500">{stat.label}</span>
                    </div>
                    <span className="text-2xl font-bold text-ink">{stat.value}</span>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-ink">Recent Platform Orders</h3>
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
                          <Badge variant={statusVariant[order.status] || "default"} className="capitalize">
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-ink">Recent Registered Vendors</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {recentVendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 bg-gray-50/50">
                    <HiBuildingStorefront className="mt-0.5 h-7 w-7 flex-shrink-0 text-gray-500" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink truncate">{vendor.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{vendor.email}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{vendor.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
