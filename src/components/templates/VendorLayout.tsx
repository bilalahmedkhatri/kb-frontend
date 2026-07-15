"use client";

import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/authStore";
import { Button } from "@/src/components/atoms/Button";
import {
  HiChartBarSquare,
  HiShoppingBag,
  HiClipboardDocumentList,
  HiCog6Tooth,
  HiArrowLeftOnRectangle,
} from "react-icons/hi2";

interface VendorLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const vendorLinks = [
  { key: "dashboard", label: "Dashboard", href: "/vendor", icon: HiChartBarSquare },
  { key: "products", label: "Products", href: "/vendor/products", icon: HiShoppingBag },
  { key: "orders", label: "Orders", href: "/vendor/orders", icon: HiClipboardDocumentList },
  { key: "settings", label: "Store Settings", href: "/vendor/settings", icon: HiCog6Tooth },
];

export function VendorLayout({ children, activeTab }: VendorLayoutProps) {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="container-app py-16">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <HiArrowLeftOnRectangle className="h-16 w-16 text-[#DDDDDD]" />
          <h2 className="text-xl font-bold text-[#222222]">Access Restricted</h2>
          <p className="text-sm text-[#717171]">Please sign in to access the vendor dashboard.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (user && user.role !== "vendor" && user.role !== "admin") {
    return (
      <div className="container-app py-16">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <HiArrowLeftOnRectangle className="h-16 w-16 text-[#DDDDDD]" />
          <h2 className="text-xl font-bold text-[#222222]">Vendor Access Only</h2>
          <p className="text-sm text-[#717171]">
            You need a vendor account to access this section.
          </p>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222222]">Vendor Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#717171]">{user?.name}</span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 flex-shrink-0 md:block">
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
                      ? "bg-[#222222] text-white"
                      : "text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="md:hidden">
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2">
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
                        ? "bg-[#222222] text-white"
                        : "bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
