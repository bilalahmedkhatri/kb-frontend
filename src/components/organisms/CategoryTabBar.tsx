"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { HiChevronLeft, HiChevronRight, HiSquares2X2 } from "react-icons/hi2";
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
          className="absolute -left-3 top-[30%] z-10 -translate-y-1/2 rounded-full bg-white p-1.5 shadow-md ring-1 ring-[#DDDDDD] transition-colors hover:bg-[#F7F7F7] max-sm:hidden"
          aria-label="Scroll left"
        >
          <HiChevronLeft className="h-4 w-4 text-[#222222]" />
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
          className="flex flex-col items-center gap-2"
        >
          <div
            className={cn(
              "flex w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 items-center justify-center rounded-full transition-all",
              !activeCategory
                ? "bg-[#222222] text-white ring-2 ring-[#222222] ring-offset-2"
                : "bg-[#F7F7F7] text-[#717171] hover:bg-[#EBEBEB]"
            )}
          >
            <HiSquares2X2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className={cn("text-[11px] sm:text-xs font-medium whitespace-nowrap", !activeCategory ? "text-[#222222]" : "text-[#717171]")}>
            All
          </span>
        </button>
        {categories.map((category) => {
          const isActive = activeCategory === category.slug;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.slug)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 overflow-hidden rounded-full transition-all",
                  isActive ? "ring-2 ring-[#222222] ring-offset-2" : "hover:opacity-80"
                )}
              >
                <img
                  src={`https://picsum.photos/seed/${category.slug}/200/200`}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className={cn("text-[11px] sm:text-xs font-medium whitespace-nowrap", isActive ? "text-[#222222]" : "text-[#717171]")}>
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
