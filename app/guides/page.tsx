"use client";

import { useState, useEffect } from "react";
import { GuideGrid } from "@/src/components/organisms/GuideGrid";
import { TagPill } from "@/src/components/molecules/TagPill";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { api } from "@/src/lib/api";
import type { Guide } from "@/src/types";

const topics = ["Culture", "Food", "Adventure", "History"];

export default function GuidesIndexPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    const filters = activeTopic ? { categories: [activeTopic] } : undefined;
    api.getGuides({ pageSize: 50, filters })
      .then((res) => {
        if (!cancelled) {
          setGuides(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load guides. Please try again.");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [activeTopic, retryKey]);

  const filteredGuides = activeTopic
    ? guides.filter((g) => g.topic === activeTopic)
    : guides;

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#222222]">Island Guides</h1>
        <p className="mt-1 text-sm text-[#717171]">
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
      ) : loading ? (
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
          <p className="text-base font-medium text-[#222222]">No guides found</p>
          <p className="mt-1 text-sm text-[#717171]">
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
