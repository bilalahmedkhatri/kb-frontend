import { Spinner } from "@/src/components/atoms/Spinner";

export default function OrderDetailsLoading() {
  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-8 w-28 animate-pulse rounded-full bg-gray-200" />
      </div>

      {/* Stepper Skeleton */}
      <div className="h-24 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-50" />

      {/* Items Skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-20 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
        <div className="h-20 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
      </div>

      {/* Summary Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-44 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
        <div className="h-44 w-full animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
      </div>

      <div className="flex items-center justify-center py-4">
        <Spinner size="md" />
      </div>
    </div>
  );
}
