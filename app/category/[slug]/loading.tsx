import { Skeleton } from "@/src/components/atoms/Skeleton";

export default function CategoryLoading() {
  return (
    <div className="container-app py-8 w-full animate-pulse space-y-8">
      {/* Category Banner & Title Header Skeleton */}
      <div className="space-y-3 rounded-2xl bg-gray-100 p-8 border border-gray-200">
        <Skeleton variant="text" className="h-9 w-64 bg-gray-200" />
        <Skeleton variant="text" className="h-4 w-96 max-w-full bg-gray-200" />
      </div>

      {/* Horizontal Filter Pill Bar Skeleton */}
      <div className="flex flex-wrap gap-2.5 items-center border-b border-gray-200 pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            className="h-9 w-28 rounded-full bg-gray-100"
          />
        ))}
      </div>

      {/* 3-Column / 4-Column Product Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton variant="card" className="aspect-square w-full rounded-xl bg-gray-200" />
            <Skeleton variant="text" className="h-4 w-3/4 bg-gray-200" />
            <Skeleton variant="text" className="h-3.5 w-1/2 bg-gray-100" />
            <Skeleton variant="text" className="h-4 w-1/4 bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
