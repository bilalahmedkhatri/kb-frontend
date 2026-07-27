"use client";

import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/authStore";
import { Button } from "@/src/components/atoms/Button";
import { useSyncExternalStore } from "react";
import {
  HiBuildingStorefront,
  HiCube,
  HiClipboardDocumentList,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
  HiUser,
  HiEye,
} from "react-icons/hi2";
import {
  HiBuildingStorefront as IconStore,
  HiCube as IconCube,
  HiClipboardDocumentList as IconOrders,
  HiCog6Tooth as IconSettings,
  HiUser as IconUser,
  HiArrowRightOnRectangle as IconLogout,
} from "react-icons/hi2";

interface VendorLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const vendorLinks = [
  { key: "dashboard", label: "Dashboard", href: "/vendor/dashboard", icon: IconStore },
  { key: "products", label: "My Products", href: "/vendor/products", icon: IconCube },
  { key: "orders", label: "Incoming Orders", href: "/vendor/orders", icon: IconOrders },
  { key: "store-settings", label: "Storefront Settings", href: "/vendor/store-settings", icon: IconSettings },
];

export function VendorLayout({ children, activeTab }: VendorLayoutProps) {
  const { isAuthenticated, user } = useAuthStore();
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

  if (mounted && (!isAuthenticated || (user?.role !== "vendor" && user?.role !== "admin"))) {
    return (
      <div className="container-app py-16">
        <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <IconStore className="mx-auto mb-4 h-12 w-12 text-[#FF385C]" />
          <h2 className="mb-2 text-xl font-bold text-ink">Vendor Portal Access</h2>
          <p className="mb-6 text-sm text-gray-500">
            You must be signed in with an approved Vendor or Artisan account to access the Vendor Workspace.
          </p>
          <Link href="/login?redirect=/vendor/dashboard">
            <Button className="w-full">Sign In as Vendor</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <div className="flex flex-col gap-0 md:flex-row md:gap-8">
        <aside className="hidden w-60 flex-shrink-0 md:block">
          <nav className="flex flex-col gap-1">
            {vendorLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.key;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#FF385C] text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-ink"
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
            {vendorLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.key;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#FF385C] text-white"
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
