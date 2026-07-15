"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import {
  HiUser,
  HiShoppingBag,
  HiHeart,
  HiChatBubbleLeft,
  HiChevronRight,
} from "react-icons/hi2";

interface AccountLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const accountLinks = [
  { key: "profile", label: "Profile", href: "/account", icon: HiUser },
  { key: "orders", label: "Orders", href: "/account/orders", icon: HiShoppingBag },
  { key: "reviews", label: "Reviews", href: "/account/reviews", icon: HiChatBubbleLeft },
  { key: "wishlist", label: "Wishlist", href: "/account/wishlist", icon: HiHeart },
];

export function AccountLayout({ children, activeTab }: AccountLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="container-app py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#222222]">My Account</h1>

      <div className="flex gap-8">
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
        </aside>

        <div className="md:hidden">
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2">
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
        </div>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
