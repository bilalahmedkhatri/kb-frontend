"use client";

import { cn } from "@/src/lib/utils";
import { GuideCard } from "@/src/components/molecules/GuideCard";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { HiBookOpen } from "react-icons/hi2";
import type { Guide } from "@/src/types";

interface GuideGridProps {
  guides: Guide[];
  isLoading: boolean;
  className?: string;
}

export function GuideGrid({ guides, isLoading, className }: GuideGridProps) {
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <Skeleton variant="rectangular" className="h-[400px] w-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-[280px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (guides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <HiBookOpen className="mb-3 h-12 w-12 text-[#DDDDDD]" />
        <p className="text-base font-medium text-[#717171]">No guides available yet</p>
      </div>
    );
  }

  const [featured, ...rest] = guides;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {featured && (
        <GuideCard guide={featured} variant="featured" className="lg:col-span-2" />
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((guide) => (
          <GuideCard key={guide.id} guide={guide} variant="default" />
        ))}
      </div>
    </div>
  );
}
