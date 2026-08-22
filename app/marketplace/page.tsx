"use client";

import { useState } from "react";
import { MarketplaceLayout } from "@/src/components/templates/MarketplaceLayout";
import { FilterSidebar } from "@/src/components/organisms/FilterSidebar";
import { ProductGrid } from "@/src/components/organisms/ProductGrid";
import { SortSelect } from "@/src/components/molecules/SortSelect";
import { JsonLd } from "@/src/components/atoms/JsonLd";
import { Button } from "@/src/components/atoms/Button";
import { ErrorState } from "@/src/components/molecules/ErrorState";
import { useProducts, useCategories } from "@/src/hooks";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

export default function MarketplacePage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const categoriesQuery = useCategories("product");
  const productsQuery = useProducts({
    page,
    pageSize: 12,
    filters: { categories: activeCategories, sort, priceRange },
  });

  const sidebar = (
    <FilterSidebar
      categories={categoriesQuery.data ?? []}
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

  const itemListSchema = productsQuery.data
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Kiribati Handicrafts Marketplace",
        "itemListElement": productsQuery.data.data.map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.name,
            "url": `https://islandconnects.com/product/${product.id}`,
            "image": product.images[0],
            "offers": {
              "@type": "Offer",
              "priceCurrency": "AUD",
              "price": product.price,
            },
          },
        })),
      }
    : null;

  return (
    <>
      {itemListSchema && <JsonLd data={itemListSchema} />}
      <MarketplaceLayout sidebar={sidebar}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {productsQuery.data
                ? `${productsQuery.data.total} product${productsQuery.data.total !== 1 ? "s" : ""} found`
                : ""}
            </p>
            <SortSelect
              value={sort}
              onChange={(s) => { setSort(s); setPage(1); }}
              options={sortOptions}
            />
          </div>
          {productsQuery.isError ? (
            <ErrorState
              title="Could not load marketplace products"
              description="We ran into a problem loading the listing catalog. Please try again."
              onRetry={() => void productsQuery.refetch()}
            />
          ) : (
            <ProductGrid
              products={productsQuery.data?.data ?? []}
              isLoading={productsQuery.isLoading}
              totalPages={productsQuery.data?.totalPages}
              currentPage={productsQuery.data?.page}
              onPageChange={setPage}
              emptyMessage="No products found. Try adjusting your filters."
            />
          )}
        </div>
      </MarketplaceLayout>
    </>
  );
}
