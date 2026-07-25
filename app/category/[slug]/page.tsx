"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MarketplaceLayout } from "@/src/components/templates/MarketplaceLayout";
import { FilterSidebar } from "@/src/components/organisms/FilterSidebar";
import { ProductGrid } from "@/src/components/organisms/ProductGrid";
import { SortSelect } from "@/src/components/molecules/SortSelect";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { api } from "@/src/lib/api";
import type { Category, Product, PaginatedResponse } from "@/src/types";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<PaginatedResponse<Product>>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [cats, prodRes] = await Promise.all([
          api.getCategories("product"),
          api.getProducts({
            page,
            pageSize: 12,
            filters: { categories: [slug], sort },
          }),
        ]);
        setAllCategories(cats);
        setCategory(cats.find((c) => c.slug === slug) || null);
        setProducts(prodRes);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [slug]);

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
      prev.includes(catSlug)
        ? prev.filter((c) => c !== catSlug)
        : [...prev, catSlug]
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

  if (loading && !products) {
    return (
      <div className="container-app py-8">
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="flex gap-8">
          <aside className="hidden w-[260px] lg:block">
            <Skeleton variant="rectangular" className="h-96 w-full" />
          </aside>
          <div className="flex-1">
            <ProductGrid products={[]} isLoading={true} />
          </div>
        </div>
      </div>
    );
  }

  if (!category && !loading) {
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
