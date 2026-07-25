"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface InfoLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const navItems = [
  { label: "About Us", href: "/about" },
  { label: "Artisan Fair Trade", href: "/fair-trade" },
  { label: "Contact Support", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
  { label: "Payment & Bank Transfer", href: "/payment" },
  { label: "Cancellations", href: "/cancellations" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Blog & Articles", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Island Map", href: "/map" },
];

export function InfoLayout({ title, subtitle, children }: InfoLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--gray-50)] py-10">
      <div className="container-app">
        {/* Header Hero Section */}
        <div className="mb-8 rounded-3xl border border-[var(--gray-200)] bg-white p-8 shadow-xs">
          <h1 className="text-3xl font-black text-[var(--ink)] tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-[var(--gray-500)] max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 rounded-2xl border border-[var(--gray-200)] bg-white p-4 shadow-xs">
              <h2 className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-[var(--gray-500)]">
                Help & Information
              </h2>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                        isActive
                          ? "bg-[var(--rausch)] text-white font-bold"
                          : "text-[var(--gray-700)] hover:bg-[var(--gray-100)] hover:text-[var(--ink)]"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <div className="rounded-3xl border border-[var(--gray-200)] bg-white p-8 shadow-xs">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
