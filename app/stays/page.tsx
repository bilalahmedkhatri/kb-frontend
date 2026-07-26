"use client";

import { useState, useEffect } from "react";
import { StayGrid } from "@/src/components/organisms/StayGrid";
import { SortSelect } from "@/src/components/molecules/SortSelect";
import { TagPill } from "@/src/components/molecules/TagPill";
import { api } from "@/src/lib/api";
import type { Stay, PaginatedResponse } from "@/src/types";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

const stayTypes = [
  { label: "All", value: "" },
  { label: "Homestays", value: "homestay" },
  { label: "Eco-Lodges", value: "eco-lodge" },
  { label: "Villas", value: "villa" },
  { label: "Guesthouses", value: "guesthouse" },
];

export default function StaysPage() {
  const [stays, setStays] = useState<PaginatedResponse<Stay>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [activeType, setActiveType] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api.getStays({
      page,
      pageSize: 12,
      filters: {
        categories: activeType ? [activeType] : [],
        sort,
      },
    })
      .then((res) => {
        if (!cancelled) {
          setStays(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load stays. Please try again.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [page, sort, activeType, retryKey]);

  return (
    <div className="container-app py-8">
      <div className="mb-6 flex flex-wrap gap-2">
        {stayTypes.map((t) => (
          <TagPill
            key={t.value}
            label={t.label}
            active={activeType === t.value}
            onClick={() => { setActiveType(t.value); setPage(1); }}
          />
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#717171]">
          {stays ? `${stays.total} stays found` : ""}
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
        <StayGrid
          stays={stays?.data || []}
          isLoading={loading}
          totalPages={stays?.totalPages}
          currentPage={stays?.page}
          onPageChange={setPage}
          emptyMessage="No stays match your filters. Try a different type."
        />
      )}
    </div>
  );
}
