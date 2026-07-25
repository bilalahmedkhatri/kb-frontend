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
} from "react-icons/hi2";
import { cn } from "@/src/lib/utils";
import { Avatar } from "@/src/components/atoms/Avatar";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { Logo } from "@/src/components/atoms/Logo";
import { useAuthStore } from "@/src/store/authStore";
import { useCartStore } from "@/src/store/cartStore";
import { useUIStore } from "@/src/store/uiStore";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Stays", href: "/stays" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Experiences", href: "/experiences" },
  { label: "Guides", href: "/guides" },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const { isMobileNavOpen, toggleMobileNav, closeMobileNav, openCart } = useUIStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const count = mounted ? itemCount() : 0;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--gray-300)] bg-white shadow-xs">
      <div className="container-app flex items-center justify-between py-3">
        <div className="flex items-center">
          <Logo className="hover:opacity-95 transition-opacity" />
        </div>
        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-[var(--ink)] underline underline-offset-8 decoration-[var(--rausch)] decoration-2 font-bold"
                  : "text-[var(--gray-500)] hover:bg-[var(--gray-100)] hover:text-[var(--ink)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#222222] transition-colors hover:bg-[#F7F7F7]"
            aria-label="Open cart"
          >
            <HiShoppingCart className="h-5 w-5" />
            <Badge variant="primary" className={`absolute -right-0.5 -top-0.5 h-5 min-w-5 px-1 text-[10px] ${count === 0 ? 'invisible' : ''}`}>
              {count}
            </Badge>
          </button>

          <Link
            href="/wishlist"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-[#222222] transition-colors hover:bg-[#F7F7F7] sm:flex"
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
                className="flex items-center gap-2 rounded-full bg-white px-1 py-1.5 transition-colors hover:bg-[#f6d9d9]"
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <HiChevronDown className="hidden h-4 w-4 text-[#717171] sm:block" />
              </button>
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[#DDDDDD] bg-white py-2 shadow-lg">
                    <div className="border-b border-[#DDDDDD] px-4 py-2">
                      <p className="text-sm font-semibold text-[#222222]">{user.name}</p>
                      <p className="text-xs text-[#717171]">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#222222] hover:bg-[#F7F7F7]"
                    >
                      <HiUser className="h-4 w-4" />
                      My Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#222222] hover:bg-[#F7F7F7]"
                    >
                      <HiArrowRightOnRectangle className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" leftIcon={<HiUser className="h-4 w-4" />}>
                Sign In
              </Button>
            </Link>
          )}

          <button
            type="button"
            onClick={toggleMobileNav}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#222222] transition-colors hover:bg-[#F7F7F7] md:hidden"
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileNav}
                className={cn(
                  "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  pathname === link.href
                    ? "bg-red-200/90 text-[#222222]"
                    : "text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-[#DDDDDD]" />
            <Link
              href="/wishlist"
              onClick={closeMobileNav}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]"
            >
              <HiHeart className="h-5 w-5" />
              Wishlist
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
