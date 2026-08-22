"use client";

import { useState } from "react";
import { GuideGrid } from "@/src/components/organisms/GuideGrid";
import { TagPill } from "@/src/components/molecules/TagPill";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { Button } from "@/src/components/atoms/Button";
import { ErrorState } from "@/src/components/molecules/ErrorState";
import { useGuides } from "@/src/hooks";

const topics = ["Culture", "Food", "Adventure", "History"];

export default function GuidesIndexPage() {
  const [activeTopic, setActiveTopic] = useState("");

  const guidesQuery = useGuides({
    pageSize: 50,
    filters: activeTopic ? { categories: [activeTopic] } : undefined,
  });

  const guides = guidesQuery.data?.data ?? [];
  const filteredGuides = activeTopic
    ? guides.filter((g) => g.topic === activeTopic)
    : guides;

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Island Guides</h1>
        <p className="mt-1 text-sm text-gray-500">
          Discover the stories, culture, and adventures of Kiribati
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <TagPill
          label="All"
          active={activeTopic === ""}
          onClick={() => setActiveTopic("")}
        />
        {topics.map((topic) => (
          <TagPill
            key={topic}
            label={topic}
            active={activeTopic === topic}
            onClick={() => setActiveTopic(topic)}
          />
        ))}
      </div>

      {guidesQuery.isError ? (
        <ErrorState
          title="Could not load island guides"
          description="We couldn't retrieve the cultural guides catalog. Please check your connection and retry."
          onRetry={() => void guidesQuery.refetch()}
        />
      ) : guidesQuery.isLoading ? (
        <div>
          <Skeleton variant="rectangular" className="mb-6 h-[400px] w-full" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" className="h-[280px] w-full" />
            ))}
          </div>
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-base font-medium text-ink">No guides found</p>
          <p className="mt-1 text-sm text-gray-500">
            {activeTopic
              ? `No guides available for "${activeTopic}" yet. Try a different topic.`
              : "Guides are coming soon. Check back for stories, culture, and adventures."}
          </p>
        </div>
      ) : (
        <GuideGrid guides={filteredGuides} isLoading={false} />
      )}
    </div>
  );
}
