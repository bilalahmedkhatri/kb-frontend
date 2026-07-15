"use client";

import { cn } from "@/src/lib/utils";
import { Checkbox } from "@/src/components/atoms/Checkbox";
import { PriceRangeInput } from "@/src/components/molecules/PriceRangeInput";
import { SortSelect } from "@/src/components/molecules/SortSelect";
import { HiAdjustmentsHorizontal, HiArrowPath } from "react-icons/hi2";
import type { Category } from "@/src/types";

interface FilterSidebarProps {
  categories: Category[];
  activeCategories: string[];
  priceRange: [number, number];
  sort: string;
  onCategoryChange: (cat: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onSortChange: (sort: string) => void;
  className?: string;
}

export function FilterSidebar({
  categories,
  activeCategories,
  priceRange,
  sort,
  onCategoryChange,
  onPriceChange,
  onSortChange,
  className,
}: FilterSidebarProps) {
  const hasActiveFilters = activeCategories.length > 0 || sort !== "";

  const clearAll = () => {
    activeCategories.forEach((cat) => onCategoryChange(cat));
    onSortChange("");
  };

  return (
    <aside className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-semibold text-[#222222]">
          <HiAdjustmentsHorizontal className="h-5 w-5" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-sm font-medium text-[#FF385C] transition-colors hover:text-[#E31C5F]"
          >
            <HiArrowPath className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      <div className="sticky top-24 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#222222]">Sort By</h3>
          <SortSelect
            value={sort}
            onChange={onSortChange}
            options={[
              { label: "Newest", value: "newest" },
              { label: "Price: Low to High", value: "price-asc" },
              { label: "Price: High to Low", value: "price-desc" },
              { label: "Top Rated", value: "rating" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#222222]">Price Range</h3>
          <PriceRangeInput value={priceRange} onChange={onPriceChange} min={0} max={1000} />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#222222]">Categories</h3>
          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <Checkbox
                key={category.id}
                id={`cat-${category.slug}`}
                label={category.name}
                checked={activeCategories.includes(category.slug)}
                onChange={() => onCategoryChange(category.slug)}
                count={category.count}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
