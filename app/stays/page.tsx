"use client";

import { useState } from "react";
import { StayGrid } from "@/src/components/organisms/StayGrid";
import { SortSelect } from "@/src/components/molecules/SortSelect";
import { TagPill } from "@/src/components/molecules/TagPill";
import { Button } from "@/src/components/atoms/Button";
import { useStays } from "@/src/hooks";

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
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [activeType, setActiveType] = useState("");

  const staysQuery = useStays({
    page,
    pageSize: 12,
    filters: {
      categories: activeType ? [activeType] : [],
      sort,
    },
  });

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
        <p className="text-sm text-gray-500">
          {staysQuery.data ? `${staysQuery.data.total} stays found` : ""}
        </p>
        <SortSelect
          value={sort}
          onChange={(s) => { setSort(s); setPage(1); }}
          options={sortOptions}
        />
      </div>

      {staysQuery.isError ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="mb-2 text-base font-medium text-ink">
            Could not load stays. Please try again.
          </p>
          <Button
            variant="primary"
            className="mt-2"
            onClick={() => void staysQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <StayGrid
          stays={staysQuery.data?.data ?? []}
          isLoading={staysQuery.isLoading}
          totalPages={staysQuery.data?.totalPages}
          currentPage={staysQuery.data?.page}
          onPageChange={setPage}
          emptyMessage="No stays match your filters. Try a different type."
        />
      )}
    </div>
  );
}
