"use client";

import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/atoms/Button";
import { HiAdjustmentsHorizontal, HiXMark } from "react-icons/hi2";

interface MarketplaceLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  className?: string;
}

export function MarketplaceLayout({ children, sidebar, className }: MarketplaceLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="container-app py-6">
      <div className={cn("flex gap-8", className)}>
        <aside className="hidden w-[260px] flex-shrink-0 lg:block">
          <div className="sticky top-24">{sidebar}</div>
        </aside>

        <div className="flex-1 min-w-0">{children}</div>
      </div>

      <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 lg:hidden">
        <Button
          onClick={() => setIsSidebarOpen(true)}
          leftIcon={<HiAdjustmentsHorizontal className="h-4 w-4" />}
        >
          Filters
        </Button>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 z-10 w-[280px] overflow-y-auto bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold text-[#222222]">Filters</span>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#717171] transition-colors hover:bg-[#F7F7F7]"
                aria-label="Close filters"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}
