"use client";

import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/authStore";
import { Button } from "@/src/components/atoms/Button";
import { useSyncExternalStore } from "react";
import {
  HiShieldCheck,
  HiCube,
  HiBuildingStorefront,
  HiCog6Tooth,
  HiUser,
  HiChartBar,
} from "react-icons/hi2";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const adminLinks = [
  { key: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: HiChartBar },
  { key: "products", label: "Listing Moderation", href: "/admin/products", icon: HiCube },
  { key: "vendors", label: "Manage Vendors", href: "/admin/vendors", icon: HiBuildingStorefront },
  { key: "settings", label: "Platform Settings", href: "/admin/settings", icon: HiCog6Tooth },
];

export function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const { isAuthenticated, user } = useAuthStore();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (mounted && (!isAuthenticated || user?.role !== "admin")) {
    return (
      <div className="container-app py-16">
        <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <HiShieldCheck className="mx-auto mb-4 h-12 w-12 text-red-600" />
          <h2 className="mb-2 text-xl font-bold text-ink">Admin Access Required</h2>
          <p className="mb-6 text-sm text-gray-500">
            You must be signed in with an Administrator role to access the Platform Admin Portal.
          </p>
          <Link href="/login?redirect=/admin/dashboard">
            <Button className="w-full bg-red-600 hover:bg-red-700">Sign In as Administrator</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink">Admin Control Center</h1>
            <span className="rounded-full bg-red-100 px-3 py-0.5 text-xs font-bold text-red-700">
              Platform Admin
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Moderate vendor handicraft listings, manage merchant approvals, and set platform rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-gray-50"
          >
            <HiUser className="h-4 w-4 text-gray-500" />
            Customer View
          </Link>
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-black"
          >
            <HiBuildingStorefront className="h-4 w-4" />
            Vendor View
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-0 md:flex-row md:gap-8">
        <aside className="hidden w-60 flex-shrink-0 md:block">
          <nav className="flex flex-col gap-1">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.key;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-700"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Tab Scrollbar */}
        <div className="w-full min-w-0 md:hidden mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.key;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:text-ink"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
