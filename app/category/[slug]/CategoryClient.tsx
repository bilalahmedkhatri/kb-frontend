"use client";

import { useState, useEffect } from "react";
import { MarketplaceLayout } from "@/src/components/templates/MarketplaceLayout";
import { FilterSidebar } from "@/src/components/organisms/FilterSidebar";
import { ProductGrid } from "@/src/components/organisms/ProductGrid";
import { SortSelect } from "@/src/components/molecules/SortSelect";
import { api } from "@/src/lib/api";
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
  initialProducts: PaginatedResponse<Product>;
}

export default function CategoryClient({
  slug,
  category,
  allCategories,
  initialProducts,
}: CategoryClientProps) {
  const [products, setProducts] = useState<PaginatedResponse<Product>>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    async function refetch() {
      setLoading(true);
      try {
        const prodRes = await api.getProducts({
          page,
          pageSize: 12,
          filters: { categories: [slug, ...activeCategories], sort, priceRange },
        });
        setProducts(prodRes);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    refetch();
  }, [page, sort, activeCategories, priceRange, slug]);

  const handleCategoryChange = (catSlug: string) => {
    setActiveCategories((prev) =>
      prev.includes(catSlug) ? prev.filter((c) => c !== catSlug) : [...prev, catSlug]
    );
    setPage(1);
  };

  const sidebar = (
    <FilterSidebar
      categories={allCategories}
      activeCategories={[slug, ...activeCategories]}
      priceRange={priceRange}
      sort={sort}
      onCategoryChange={handleCategoryChange}
      onPriceChange={(range) => { setPriceRange(range); setPage(1); }}
      onSortChange={(s) => { setSort(s); setPage(1); }}
    />
  );

  if (!category) {
    return (
      <div className="container-app py-20 text-center">
        <h2 className="text-xl font-bold text-[#222222]">Category not found</h2>
        <p className="mt-2 text-[#717171]">The category you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <MarketplaceLayout sidebar={sidebar}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#222222]">{category?.name || slug}</h1>
          <SortSelect
            value={sort}
            onChange={(s) => { setSort(s); setPage(1); }}
            options={sortOptions}
          />
        </div>

        <ProductGrid
          products={products?.data || []}
          isLoading={loading}
          totalPages={products?.totalPages}
          currentPage={products?.page}
          onPageChange={setPage}
          emptyMessage={`No ${category?.name?.toLowerCase() || "products"} found`}
        />
      </div>
    </MarketplaceLayout>
  );
}
