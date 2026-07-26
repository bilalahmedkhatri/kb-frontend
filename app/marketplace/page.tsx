"use client";

import { useState, useEffect } from "react";
import { MarketplaceLayout } from "@/src/components/templates/MarketplaceLayout";
import { FilterSidebar } from "@/src/components/organisms/FilterSidebar";
import { ProductGrid } from "@/src/components/organisms/ProductGrid";
import { SortSelect } from "@/src/components/molecules/SortSelect";
import { api } from "@/src/lib/api";
import type { Product, PaginatedResponse } from "@/src/types";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

export default function MarketplacePage() {
  const [products, setProducts] = useState<PaginatedResponse<Product>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api.getProducts({
      page,
      pageSize: 12,
      filters: { categories: activeCategories, sort, priceRange },
    })
      .then((res) => {
        if (!cancelled) {
          setProducts(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load products. Please try again.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [page, sort, activeCategories, priceRange, retryKey]);

  const sidebar = (
    <FilterSidebar
      categories={[]}
      activeCategories={activeCategories}
      priceRange={priceRange}
      sort={sort}
      onCategoryChange={(cat) => {
        setActiveCategories((prev) =>
          prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
        setPage(1);
      }}
      onPriceChange={(range) => { setPriceRange(range); setPage(1); }}
      onSortChange={(s) => { setSort(s); setPage(1); }}
    />
  );

  return (
    <div className="container-app flex flex-col px-0 pt-8 pb-12">
      <MarketplaceLayout sidebar={sidebar}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#717171]">
              {products ? `${products.total} product${products.total !== 1 ? "s" : ""} found` : ""}
            </p>
            <SortSelect
              value={sort}
              onChange={(s) => { setSort(s); setPage(1); }}
              options={sortOptions}
            />
          </div>
          {error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="mb-2 text-base font-medium text-[#222222]">{error}</p>
              <button
                type="button"
                onClick={() => { setError(null); setLoading(true); setRetryKey((k) => k + 1); }}
                className="mt-2 rounded-lg bg-[#222222] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#222222]/80"
              >
                Try again
              </button>
            </div>
          ) : (
            <ProductGrid
              products={products?.data || []}
              isLoading={loading}
              totalPages={products?.totalPages}
              currentPage={products?.page}
              onPageChange={setPage}
              emptyMessage="No products found. Try adjusting your filters."
            />
          )}
        </div>
      </MarketplaceLayout>
    </div>
  );
}
