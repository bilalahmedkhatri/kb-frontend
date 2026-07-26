"use client";

import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/store/authStore";
import { Button } from "@/src/components/atoms/Button";
import { useSyncExternalStore } from "react";
import {
  HiUser,
  HiCalendarDays,
  HiShoppingBag,
  HiHeart,
  HiChatBubbleLeft,
  HiEnvelope,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

interface AccountLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const accountLinks = [
  { key: "profile", label: "Profile", href: "/account", icon: HiUser },
  { key: "bookings", label: "Bookings", href: "/account/bookings", icon: HiCalendarDays },
  { key: "orders", label: "Orders", href: "/account/orders", icon: HiShoppingBag },
  { key: "saved", label: "Saved", href: "/account/saved", icon: HiHeart },
  { key: "reviews", label: "Reviews", href: "/account/reviews", icon: HiChatBubbleLeft },
  { key: "messages", label: "Messages", href: "/account/messages", icon: HiEnvelope },
];

export function AccountLayout({ children, activeTab }: AccountLayoutProps) {
  const { isAuthenticated, user } = useAuthStore();
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

  if (mounted && !isAuthenticated) {
    return (
      <div className="container-app overflow-x-hidden py-16">
        <div className="mx-auto max-w-md rounded-xl border border-[var(--gray-300)] p-8 text-center">
          <HiArrowRightOnRectangle className="mx-auto mb-4 h-12 w-12 text-[var(--gray-300)]" />
          <h2 className="mb-2 text-xl font-bold text-[var(--ink)]">Sign in to Your Account</h2>
          <p className="mb-6 text-sm text-[var(--gray-500)]">
            Access your profile, bookings, orders, saved items, and more.
          </p>
          <Link href="/login?redirect=/account">
            <Button className="w-full">Sign In / Register</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isVendor = user?.role === "vendor" || user?.role === "admin";

  return (
    <div className="container-app overflow-x-hidden py-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--ink)]">My Account</h1>

      <div className="flex flex-col gap-0 md:flex-row md:gap-8">
        <aside className="hidden w-56 flex-shrink-0 md:block">
          <nav className="flex flex-col gap-1">
            {accountLinks.map((link) => {
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
                      : "text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {isVendor && (
            <div className="mt-6 border-t border-[#DDDDDD] pt-6">
              <Link
                href="/vendor/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  "text-[#FF385C] hover:bg-[#FFF0F3]"
                )}
              >
                <HiArrowRightOnRectangle className="h-5 w-5" />
                Switch to Vendor Mode
              </Link>
            </div>
          )}
        </aside>

        <div className="w-full min-w-0 md:hidden">
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-4">
              {accountLinks.map((link) => {
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
          {isVendor && (
            <div className="mb-6">
              <Link
                href="/vendor/dashboard"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#FFF0F3] px-4 py-2.5 text-sm font-medium text-[#FF385C] transition-colors hover:bg-[#FFE4E8]"
              >
                <HiArrowRightOnRectangle className="h-4 w-4" />
                Switch to Vendor Mode
              </Link>
            </div>
          )}
        </div>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}