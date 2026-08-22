"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/src/components/molecules/SearchBar";
import { ProductGrid } from "@/src/components/organisms/ProductGrid";
import { StayGrid } from "@/src/components/organisms/StayGrid";
import { GuideGrid } from "@/src/components/organisms/GuideGrid";
import { Button } from "@/src/components/atoms/Button";
import { cn } from "@/src/lib/utils";
import { useProducts, useStays, useGuides } from "@/src/hooks";
import { HiMagnifyingGlass } from "react-icons/hi2";

import { ErrorState } from "@/src/components/molecules/ErrorState";

type Tab = "all" | "products" | "stays" | "guides";

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "products", label: "Products" },
  { key: "stays", label: "Stays" },
  { key: "guides", label: "Guides" },
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || searchParams.get("query") || "";

  const [searchValue, setSearchValue] = useState(query);
  const [activeTab, setActiveTab] = useState<Tab>(
    (searchParams.get("tab") as Tab) || "all"
  );
  const [page, setPage] = useState(1);

  const sharedFilters = { search: query };
  const productsQuery = useProducts({ page, pageSize: 12, filters: sharedFilters });
  const staysQuery = useStays({ page, pageSize: 12, filters: sharedFilters });
  const guidesQuery = useGuides({ page, pageSize: 12, filters: sharedFilters });

  const loading =
    productsQuery.isLoading || staysQuery.isLoading || guidesQuery.isLoading;
  const error =
    productsQuery.error || staysQuery.error || guidesQuery.error;

  const refetchAll = () => {
    void productsQuery.refetch();
    void staysQuery.refetch();
    void guidesQuery.refetch();
  };

  const handleSearch = (val: string) => {
    setSearchValue(val);
    const params = new URLSearchParams();
    if (val) params.set("q", val);
    if (activeTab !== "all") params.set("tab", activeTab);
    router.push(`/search?${params.toString()}`);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (tab !== "all") params.set("tab", tab);
    router.push(`/search?${params.toString()}`);
  };

  const hasNoResults =
    !loading &&
    ((activeTab === "all" &&
      (productsQuery.data?.data.length ?? 0) +
        (staysQuery.data?.data.length ?? 0) +
        (guidesQuery.data?.data.length ?? 0) ===
        0) ||
      (activeTab === "products" && (productsQuery.data?.data.length ?? 0) === 0) ||
      (activeTab === "stays" && (staysQuery.data?.data.length ?? 0) === 0) ||
      (activeTab === "guides" && (guidesQuery.data?.data.length ?? 0) === 0));

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <SearchBar
          value={searchValue}
          onChange={handleSearch}
          placeholder="Search products, stays, guides..."
          className="max-w-xl"
        />
      </div>

      <div className="mb-6 flex items-center gap-2 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "border-b-2 border-ink text-ink"
                : "text-gray-500 hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <ErrorState onRetry={refetchAll} />
      ) : loading ? (
        <div>
          {activeTab === "stays" ? (
            <StayGrid stays={[]} isLoading={true} />
          ) : activeTab === "guides" ? (
            <GuideGrid guides={[]} isLoading={true} />
          ) : (
            <ProductGrid products={[]} isLoading={true} />
          )}
        </div>
      ) : hasNoResults ? (
        <div className="flex flex-col items-center justify-center py-20">
          <HiMagnifyingGlass className="mb-4 h-16 w-16 text-gray-300" />
          <h2 className="mb-2 text-xl font-bold text-ink">No results found</h2>
          <p className="text-center text-gray-500">
            {query ? (
              <>We couldn&rsquo;t find anything for &ldquo;{query}&rdquo;. Try a different search term or browse categories.</>
            ) : (
              "Enter a search term above to find products, stays, and guides."
            )}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {(activeTab === "all" || activeTab === "products") &&
            productsQuery.data &&
            productsQuery.data.data.length > 0 && (
              <section>
                {activeTab === "all" && (
                  <h3 className="mb-4 text-lg font-bold text-ink">Products</h3>
                )}
                <ProductGrid
                  products={productsQuery.data.data}
                  isLoading={false}
                  totalPages={productsQuery.data.totalPages}
                  currentPage={productsQuery.data.page}
                  onPageChange={setPage}
                />
              </section>
            )}

          {(activeTab === "all" || activeTab === "stays") &&
            staysQuery.data &&
            staysQuery.data.data.length > 0 && (
              <section>
                {activeTab === "all" && (
                  <h3 className="mb-4 text-lg font-bold text-ink">Stays</h3>
                )}
                <StayGrid
                  stays={staysQuery.data.data}
                  isLoading={false}
                  totalPages={staysQuery.data.totalPages}
                  currentPage={staysQuery.data.page}
                  onPageChange={setPage}
                />
              </section>
            )}

          {(activeTab === "all" || activeTab === "guides") &&
            guidesQuery.data &&
            guidesQuery.data.data.length > 0 && (
              <section>
                {activeTab === "all" && (
                  <h3 className="mb-4 text-lg font-bold text-ink">Guides</h3>
                )}
                <GuideGrid guides={guidesQuery.data.data} isLoading={false} />
              </section>
            )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
