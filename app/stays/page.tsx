"use client";

import { useState } from "react";
import { StayGrid } from "@/src/components/organisms/StayGrid";
import { SortSelect } from "@/src/components/molecules/SortSelect";
import { TagPill } from "@/src/components/molecules/TagPill";
import { Button } from "@/src/components/atoms/Button";
import { ErrorState } from "@/src/components/molecules/ErrorState";
import { useStays } from "@/src/hooks";
import { HiMapPin } from "react-icons/hi2";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

const stayTypes = [
  { label: "All", value: "" },
  { label: "Overwater Villas", value: "overwater-villa" },
  { label: "Eco-Lodges", value: "eco-lodge" },
  { label: "Maneaba Homestays", value: "homestay" },
  { label: "Beachfront Bungalows", value: "beachfront-bungalow" },
  { label: "Villas", value: "villa" },
  { label: "Guesthouses", value: "guesthouse" },
];

const islandLocations = [
  { label: "All Islands", value: "" },
  { label: "South Tarawa", value: "South Tarawa" },
  { label: "Kiritimati (Christmas Island)", value: "Kiritimati" },
  { label: "Abaiang", value: "Abaiang" },
  { label: "Butaritari", value: "Butaritari" },
  { label: "Maiana", value: "Maiana" },
  { label: "Abemama", value: "Abemama" },
  { label: "Outer Atolls", value: "Outer Atolls" },
];

export default function StaysPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [activeType, setActiveType] = useState("");
  const [activeIsland, setActiveIsland] = useState("");

  const staysQuery = useStays({
    page,
    pageSize: 12,
    filters: {
      categories: activeType ? [activeType] : [],
      island: activeIsland || undefined,
      sort,
    },
  });

  return (
    <div className="container-app py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--ink)] tracking-tight">
          Stays in Kiribati & Nearby Islands
        </h1>
        <p className="text-sm text-[var(--gray-500)] mt-1">
          Discover unique eco-lodges, overwater villas, and traditional Maneaba homestays across Kiribati atolls.
        </p>
      </div>

      {/* Property Type Filter Pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {stayTypes.map((t) => (
          <TagPill
            key={t.value}
            label={t.label}
            active={activeType === t.value}
            onClick={() => { setActiveType(t.value); setPage(1); }}
          />
        ))}
      </div>

      {/* Island Location Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <HiMapPin className="h-4 w-4 text-[var(--rausch)] shrink-0" />
        {islandLocations.map((loc) => (
          <button
            key={loc.value}
            onClick={() => { setActiveIsland(loc.value); setPage(1); }}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeIsland === loc.value
                ? "bg-[var(--ink)] text-white"
                : "bg-[var(--gray-100)] text-[var(--gray-700)] hover:bg-[var(--gray-200)]"
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>

      {/* Results Count & Sort */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[var(--gray-500)]">
          {staysQuery.data ? `${staysQuery.data.total} stays found` : ""}
        </p>
        <SortSelect
          value={sort}
          onChange={(s) => { setSort(s); setPage(1); }}
          options={sortOptions}
        />
      </div>

      {/* Results Grid */}
      {staysQuery.isError ? (
        <ErrorState
          title="Could not load stays"
          description="We encountered an issue loading accommodation listings. Please try again."
          onRetry={() => void staysQuery.refetch()}
        />
      ) : (
        <StayGrid
          stays={staysQuery.data?.data ?? []}
          isLoading={staysQuery.isLoading}
          totalPages={staysQuery.data?.totalPages}
          currentPage={staysQuery.data?.page}
          onPageChange={setPage}
          emptyMessage="No stays match your filters. Try a different property type or island."
        />
      )}
    </div>
  );
}

