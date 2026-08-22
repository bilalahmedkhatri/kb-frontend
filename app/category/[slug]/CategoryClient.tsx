"use client";

import { useEffect, useRef, useState } from "react";
import { MarketplaceLayout } from "@/src/components/templates/MarketplaceLayout";
import { FilterSidebar } from "@/src/components/organisms/FilterSidebar";
import { ProductGrid } from "@/src/components/organisms/ProductGrid";
import { SortSelect } from "@/src/components/molecules/SortSelect";
import { Spinner } from "@/src/components/atoms/Spinner";
import { Button } from "@/src/components/atoms/Button";
import { ErrorState } from "@/src/components/molecules/ErrorState";
import { useProducts, useInfiniteProducts, useIsMobile } from "@/src/hooks";
import type { Category, Product, PaginatedResponse } from "@/src/types";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

interface CategoryClientProps {
  slug: string;
  category: Category | null;
  allCategories: Category[];
  initialProducts?: PaginatedResponse<Product>;
}

export default function CategoryClient({
  slug,
  category,
  allCategories,
  initialProducts,
}: CategoryClientProps) {
  const isMobile = useIsMobile();
  const [sort, setSort] = useState("newest");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filters = {
    categories: [slug, ...activeCategories],
    sort,
    priceRange,
  };

  // Desktop: page-based numbered pagination
  const pagedQuery = useProducts({
    page: 1,
    pageSize: 12,
    filters,
    enabled: !isMobile,
    initialData: initialProducts,
  });

  // Mobile: cursor-based infinite scroll feed
  const infiniteQuery = useInfiniteProducts({
    pageSize: 12,
    filters,
    enabled: isMobile,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMobile || !infiniteQuery.hasNextPage || infiniteQuery.isFetchingNextPage) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void infiniteQuery.fetchNextPage();
        }
      },
      { rootMargin: "200px 0px" }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [isMobile, infiniteQuery.hasNextPage, infiniteQuery.isFetchingNextPage, infiniteQuery]);

  const handleCategoryChange = (catSlug: string) => {
    setActiveCategories((prev) =>
      prev.includes(catSlug) ? prev.filter((c) => c !== catSlug) : [...prev, catSlug]
    );
  };

  const sidebar = (
    <FilterSidebar
      categories={allCategories}
      activeCategories={[slug, ...activeCategories]}
      priceRange={priceRange}
      sort={sort}
      onCategoryChange={handleCategoryChange}
      onPriceChange={setPriceRange}
      onSortChange={setSort}
    />
  );

  if (!category) {
    return (
      <div className="container-app py-20 text-center">
        <h2 className="text-xl font-bold text-ink">Category not found</h2>
        <p className="mt-2 text-gray-500">The category you are looking for does not exist.</p>
      </div>
    );
  }

  const query = isMobile ? infiniteQuery : pagedQuery;
  const products = isMobile
    ? (infiniteQuery.data?.pages ?? []).flatMap((page) => page.data)
    : (pagedQuery.data?.data ?? []);
  const isLoading = isMobile ? infiniteQuery.isLoading : pagedQuery.isLoading;
  const isError = isMobile ? infiniteQuery.isError : pagedQuery.isError;

  return (
    <MarketplaceLayout sidebar={sidebar}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ink">{category?.name || slug}</h1>
          <SortSelect
            value={sort}
            onChange={setSort}
            options={sortOptions}
          />
        </div>

        {isError ? (
          <ErrorState
            title={`Could not load ${category.name}`}
            description="We couldn't retrieve products for this category. Please check your connection and retry."
            onRetry={() => {
              if (isMobile) void infiniteQuery.refetch();
              else void pagedQuery.refetch();
            }}
          />
        ) : (
          <>
            <ProductGrid
              products={products}
              isLoading={isLoading}
              totalPages={pagedQuery.data?.totalPages}
              currentPage={pagedQuery.data?.page}
              onPageChange={(p) => void pagedQuery.refetch()}
              emptyMessage={`No ${category?.name?.toLowerCase() || "products"} found`}
            />
            {/* Infinite scroll sentinel (mobile feeds) */}
            {isMobile && infiniteQuery.hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center py-6" aria-label="Loading more">
                {infiniteQuery.isFetchingNextPage ? (
                  <Spinner className="h-6 w-6" />
                ) : (
                  <span className="text-sm text-gray-500">Scroll for more</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </MarketplaceLayout>
  );
}
