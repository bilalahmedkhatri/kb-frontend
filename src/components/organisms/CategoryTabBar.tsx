"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { HiChevronLeft, HiChevronRight, HiSquares2X2 } from "react-icons/hi2";
import { CategoryIcon } from "@/src/components/atoms/CategoryIcon";
import type { Category } from "@/src/types";

interface CategoryTabBarProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange: (slug: string) => void;
  className?: string;
}

export function CategoryTabBar({
  categories,
  activeCategory,
  onCategoryChange,
  className,
}: CategoryTabBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canCenter, setCanCenter] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    setCanCenter(scrollWidth > 0 && scrollWidth <= clientWidth);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className={cn("relative w-full", className)}>
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-3 top-[30%] z-10 -translate-y-1/2 rounded-full bg-white p-1.5 shadow-md ring-1 ring-[var(--gray-300)] transition-colors hover:bg-[var(--gray-100)] max-sm:hidden"
          aria-label="Scroll left"
        >
          <HiChevronLeft className="h-4 w-4 text-[var(--ink)]" />
        </button>
      )}
      <div
        ref={scrollRef}
        className={cn(
          "flex items-start gap-4 overflow-x-auto scroll-smooth py-2 sm:gap-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          canCenter && "justify-center"
        )}
      >
        <button
          type="button"
          onClick={() => onCategoryChange("")}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div
            className={cn(
              "flex w-12 h-12 sm:w-12 sm:h-12 lg:w-14 lg:h-14 items-center justify-center rounded-full transition-all shadow-xs group-hover:scale-105",
              !activeCategory
                ? "bg-[var(--ink)] text-white ring-2 ring-[var(--ink)] ring-offset-2 scale-105 shadow-md"
                : "bg-[var(--gray-100)] text-[var(--gray-500)] hover:bg-[var(--gray-200)] hover:text-[var(--ink)] border border-[var(--gray-200)]"
            )}
          >
            <HiSquares2X2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className={cn("text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors", !activeCategory ? "text-[var(--ink)] font-bold" : "text-[var(--gray-500)] group-hover:text-[var(--ink)]")}>
            All
          </span>
        </button>
        {categories.map((category) => {
          const isActive = activeCategory === category.slug;
          const catImage = (category as any).image || `https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=200&q=80`;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.slug)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="relative">
                <div
                  className={cn(
                    "relative w-12 h-12 sm:w-12 sm:h-12 lg:w-14 lg:h-14 overflow-hidden rounded-full transition-all shadow-xs group-hover:scale-105",
                    isActive ? "ring-2 ring-[var(--ink)] ring-offset-2 scale-105 shadow-md" : "opacity-85 group-hover:opacity-100 border border-[var(--gray-200)]"
                  )}
                >
                  <Image
                    src={catImage}
                    alt={category.name}
                    fill
                    sizes="56px"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {category.icon && (
                  <div className={cn(
                    "absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white text-white shadow-xs transition-transform group-hover:scale-110",
                    isActive ? "bg-[var(--rausch)]" : "bg-[var(--ink)]"
                  )}>
                    <CategoryIcon name={category.icon} className="h-3 w-3" />
                  </div>
                )}
              </div>
              <span className={cn("text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors", isActive ? "text-[var(--ink)] font-bold" : "text-[var(--gray-500)] group-hover:text-[var(--ink)]")}>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-3 top-[30%] z-10 -translate-y-1/2 rounded-full bg-white p-1.5 shadow-md ring-1 ring-[#DDDDDD] transition-colors hover:bg-[#F7F7F7] max-sm:hidden"
          aria-label="Scroll right"
        >
          <HiChevronRight className="h-4 w-4 text-[#222222]" />
        </button>
      )}
    </div>
  );
}
