"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/src/components/molecules/SearchBar";
import { ProductGrid } from "@/src/components/organisms/ProductGrid";
import { StayGrid } from "@/src/components/organisms/StayGrid";
import { GuideGrid } from "@/src/components/organisms/GuideGrid";
import { cn } from "@/src/lib/utils";
import { api } from "@/src/lib/api";
import { HiMagnifyingGlass } from "react-icons/hi2";
import type { Product, Stay, Guide, PaginatedResponse } from "@/src/types";

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
  const [products, setProducts] = useState<PaginatedResponse<Product>>();
  const [stays, setStays] = useState<PaginatedResponse<Stay>>();
  const [guides, setGuides] = useState<PaginatedResponse<Guide>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = { search: query };
      const [prodRes, stayRes, guideRes] = await Promise.all([
        api.getProducts({ page, pageSize: 12, filters }),
        api.getStays({ page, pageSize: 12, filters }),
        api.getGuides({ page, pageSize: 12, filters }),
      ]);
      setProducts(prodRes);
      setStays(stayRes);
      setGuides(guideRes);
    } catch {
      setError("Could not load search results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

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
    ((activeTab === "all" && (products?.data.length ?? 0) + (stays?.data.length ?? 0) + (guides?.data.length ?? 0) === 0) ||
      (activeTab === "products" && (products?.data.length ?? 0) === 0) ||
      (activeTab === "stays" && (stays?.data.length ?? 0) === 0) ||
      (activeTab === "guides" && (guides?.data.length ?? 0) === 0));

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

      <div className="mb-6 flex items-center gap-2 border-b border-[#DDDDDD]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "border-b-2 border-[#222222] text-[#222222]"
                : "text-[#717171] hover:text-[#222222]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <HiMagnifyingGlass className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-[#222222]">Something went wrong</h2>
          <p className="mb-6 text-center text-[#717171]">{error}</p>
          <button
            type="button"
            onClick={fetchResults}
            className="rounded-lg bg-[#222222] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#222222]/80"
          >
            Try again
          </button>
        </div>
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
          <HiMagnifyingGlass className="mb-4 h-16 w-16 text-[#DDDDDD]" />
          <h2 className="mb-2 text-xl font-bold text-[#222222]">No results found</h2>
          <p className="text-center text-[#717171]">
            {query ? (
              <>We couldn&rsquo;t find anything for &ldquo;{query}&rdquo;. Try a different search term or browse categories.</>
            ) : (
              "Enter a search term above to find products, stays, and guides."
            )}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {(activeTab === "all" || activeTab === "products") && products && products.data.length > 0 && (
            <section>
              {activeTab === "all" && (
                <h3 className="mb-4 text-lg font-bold text-[#222222]">Products</h3>
              )}
              <ProductGrid
                products={products.data}
                isLoading={false}
                totalPages={products.totalPages}
                currentPage={products.page}
                onPageChange={setPage}
              />
            </section>
          )}

          {(activeTab === "all" || activeTab === "stays") && stays && stays.data.length > 0 && (
            <section>
              {activeTab === "all" && (
                <h3 className="mb-4 text-lg font-bold text-[#222222]">Stays</h3>
              )}
              <StayGrid
                stays={stays.data}
                isLoading={false}
                totalPages={stays.totalPages}
                currentPage={stays.page}
                onPageChange={setPage}
              />
            </section>
          )}

          {(activeTab === "all" || activeTab === "guides") && guides && guides.data.length > 0 && (
            <section>
              {activeTab === "all" && (
                <h3 className="mb-4 text-lg font-bold text-[#222222]">Guides</h3>
              )}
              <GuideGrid guides={guides.data} isLoading={false} />
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
