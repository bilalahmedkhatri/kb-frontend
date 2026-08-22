"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { ProductCard } from "@/src/components/molecules/ProductCard";
import { StayCard } from "@/src/components/molecules/StayCard";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";
import { ErrorState } from "@/src/components/molecules/ErrorState";
import type { Product, Stay } from "@/src/types";

interface FeaturedRailProps {
  items: (Product | Stay)[];
  type: "product" | "stay";
  title: string;
  viewAllHref?: string;
  className?: string;
  isError?: boolean;
  onRetry?: () => void;
}

export function FeaturedRail({
  items,
  type,
  title,
  viewAllHref,
  className,
  isError = false,
  onRetry,
}: FeaturedRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (isError) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <h2 className="text-xl font-bold text-[#222222]">{title}</h2>
        <ErrorState
          variant="compact"
          title={`Unable to load ${title.toLowerCase()}`}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#222222]">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 shrink-0 whitespace-nowrap text-sm font-semibold text-[#FF385C] transition-colors hover:text-[#E31C5F]"
          >
            View all
            <HiArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg ring-1 ring-[#DDDDDD] transition-colors hover:bg-[#F7F7F7] md:flex"
            aria-label="Scroll left"
          >
            <HiChevronLeft className="h-5 w-5 text-[#222222]" />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <div key={item.id} className="w-[160px] flex-shrink-0 sm:w-[180px] lg:w-[200px]">
              {type === "product" ? (
                <ProductCard product={item as Product} sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, 200px" />
              ) : (
                <StayCard stay={item as Stay} sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, 200px" />
              )}
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg ring-1 ring-[#DDDDDD] transition-colors hover:bg-[#F7F7F7] md:flex"
            aria-label="Scroll right"
          >
            <HiChevronRight className="h-5 w-5 text-[#222222]" />
          </button>
        )}
      </div>
    </div>
  );
}
