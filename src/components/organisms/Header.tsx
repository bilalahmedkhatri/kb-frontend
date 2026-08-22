"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiBars3,
  HiHeart,
  HiShoppingCart,
  HiUser,
  HiChevronDown,
  HiArrowRightOnRectangle,
  HiXMark,
  HiBuildingStorefront,
  HiShieldCheck,
  HiCube,
  HiClipboardDocumentList,
  HiCog6Tooth,
} from "react-icons/hi2";
import type { IconType } from "react-icons";
import { cn } from "@/src/lib/utils";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Logo } from "@/src/components/atoms/Logo";
import { useAuthStore } from "@/src/store/authStore";
import { useCartStore } from "@/src/store/cartStore";
import { useUIStore } from "@/src/store/uiStore";
import {
  publicNavItems,
  navItemsForRole,
  workspaceNavItemsForRole,
  roleForUser,
} from "@/src/lib/permissions";
import { useState, useSyncExternalStore } from "react";

const workspaceIcons: Record<string, IconType> = {
  "/vendor/dashboard": HiBuildingStorefront,
  "/vendor/products": HiCube,
  "/vendor/orders": HiClipboardDocumentList,
  "/admin/dashboard": HiShieldCheck,
  "/admin/products": HiCube,
  "/admin/vendors": HiBuildingStorefront,
  "/admin/settings": HiCog6Tooth,
};

const groupLabels: Record<"vendor" | "admin", string> = {
  vendor: "Vendor Workspace",
  admin: "Admin Portal",
};

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const { isMobileNavOpen, toggleMobileNav, closeMobileNav, openCart } = useUIStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const count = mounted ? itemCount() : 0;
  const role = mounted ? roleForUser(user) : "guest";
  const mobileNavItems = navItemsForRole(role);
  const workspaceItems = workspaceNavItemsForRole(role);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-300 bg-white shadow-xs">
      <div className="container-app flex items-center justify-between py-3">
        <div className="flex items-center">
          <Logo className="hover:opacity-95 transition-opacity" />
        </div>
        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="Main navigation">
          {publicNavItems.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-ink underline underline-offset-8 decoration-rausch decoration-2 font-bold"
                  : "text-gray-500 hover:bg-gray-100 hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-gray-100 hover:text-rausch"
            aria-label="Open cart"
          >
            <HiShoppingCart className="h-5 w-5" />
            <Badge variant="primary" className={`absolute -right-0.5 -top-0.5 h-5 min-w-5 px-1 text-[10px] ${count === 0 ? 'invisible' : ''}`}>
              {count}
            </Badge>
          </button>

          <Link
            href="/wishlist"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-gray-100 hover:text-rausch sm:flex"
            aria-label="Wishlist"
          >
            <HiHeart className="h-5 w-5" />
          </Link>

          {!mounted ? (
            <div className="h-9 w-20" />
          ) : isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full bg-white px-1 py-1.5 transition-colors hover:bg-rausch/10"
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <HiChevronDown className="hidden h-4 w-4 text-gray-500 sm:block" />
              </button>
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-gray-300 bg-white py-2 shadow-lg">
                    <div className="border-b border-gray-300 px-4 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
                        <Badge
                          variant={user.role === "admin" ? "error" : user.role === "vendor" ? "primary" : "default"}
                          className="capitalize text-[10px] px-2 py-0.5"
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* Customer Account Links */}
                    <Link
                      href="/account"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink hover:bg-gray-100"
                    >
                      <HiUser className="h-4 w-4 text-gray-500" />
                      My Profile
                    </Link>

                    {/* Vendor / Admin Workspace Links (single permission source) */}
                    {workspaceItems.map((item, index) => {
                      const Icon = workspaceIcons[item.href];
                      const showGroupHeader =
                        index === 0 || workspaceItems[index - 1].group !== item.group;
                      const isAdmin = item.group === "admin";
                      return (
                        <span key={item.href}>
                          {showGroupHeader && (
                            <>
                              <div className="my-1 border-t border-gray-300" />
                              <div className={cn(
                                "px-4 py-1 text-[10px] font-bold uppercase tracking-wider",
                                isAdmin ? "text-red-600" : "text-gray-500"
                              )}>
                                {groupLabels[item.group]}
                              </div>
                            </>
                          )}
                          <Link
                            href={item.href}
                            onClick={() => setShowUserMenu(false)}
                            className={cn(
                              "flex items-center gap-2.5 px-4 py-2 text-sm",
                              isAdmin
                                ? "text-red-700 font-semibold hover:bg-red-50"
                                : item.href === "/vendor/dashboard"
                                  ? "text-ink hover:bg-rausch/5 hover:text-rausch"
                                  : "text-ink hover:bg-gray-100"
                            )}
                          >
                            {Icon && <Icon className={cn("h-4 w-4", isAdmin ? "text-red-600" : "text-gray-500")} />}
                            {item.label}
                          </Link>
                        </span>
                      );
                    })}

                    <div className="my-1 border-t border-gray-300" />
                    <button
                      type="button"
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <HiArrowRightOnRectangle className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-block">
              <Button variant="outline" size="sm" className="px-2.5 sm:px-3.5 text-xs sm:text-sm" leftIcon={<HiUser className="h-4 w-4" />}>
                Sign In
              </Button>
            </Link>
          )}

          <button
            type="button"
            onClick={toggleMobileNav}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-gray-100 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileNavOpen ? <HiXMark className="h-5 w-5" /> : <HiBars3 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={closeMobileNav}
        >
          <div className="h-full w-full bg-black/20" />
          <div
            className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col gap-2 bg-gray-100/95 px-6 pb-8 pt-4"
            onClick={(event) => event.stopPropagation()}
          >
            {mobileNavItems.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileNav}
                className={cn(
                  "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  pathname === link.href
                    ? "bg-red-200/90 text-ink"
                    : "text-gray-500 hover:bg-gray-100 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-gray-300" />
            {!mounted ? null : isAuthenticated && user ? (
              <>
                {workspaceItems.map((item) => {
                  const Icon = workspaceIcons[item.href];
                  const isAdmin = item.group === "admin";
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileNav}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold",
                        isAdmin ? "text-red-700 hover:bg-red-50" : "text-rausch hover:bg-rausch/5"
                      )}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  type="button"
                  onClick={() => { logout(); closeMobileNav(); }}
                  className="flex items-center gap-3 w-full text-left rounded-lg px-4 py-3 text-base text-red-600 hover:bg-red-50"
                >
                  <HiArrowRightOnRectangle className="h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMobileNav}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base text-gray-500 hover:bg-gray-100 hover:text-ink"
              >
                <HiUser className="h-5 w-5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
