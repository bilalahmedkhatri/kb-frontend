import { cn } from "@/src/lib/utils";
import { StayCard } from "@/src/components/molecules/StayCard";
import { StayCardSkeleton } from "@/src/components/atoms/Skeleton";
import { Pagination } from "@/src/components/atoms/Pagination";
import { HiMapPin } from "react-icons/hi2";
import type { Stay } from "@/src/types";

interface StayGridProps {
  stays: Stay[];
  isLoading: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  className?: string;
}

export function StayGrid({
  stays,
  isLoading,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  emptyMessage = "No stays found",
  className,
}: StayGridProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <StayCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (stays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <HiMapPin className="mb-3 h-12 w-12 text-[#DDDDDD]" />
        <p className="text-base font-medium text-[#717171]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stays.map((stay) => (
          <StayCard key={stay.id} stay={stay} />
        ))}
      </div>
      {totalPages > 1 && onPageChange && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}
