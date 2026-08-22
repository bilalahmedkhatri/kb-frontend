import { Skeleton } from "@/src/components/atoms/Skeleton";

export default function VendorLoading() {
  return (
    <div className="container-app py-8 w-full animate-pulse space-y-8">
      {/* Vendor Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-8 w-60 bg-gray-200" />
          <Skeleton variant="text" className="h-4 w-40 bg-gray-100" />
        </div>
        <Skeleton variant="rectangular" className="h-10 w-36 rounded-xl bg-gray-200" />
      </div>

      {/* 4 Metric Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm">
            <Skeleton variant="text" className="h-4 w-28 bg-gray-100" />
            <Skeleton variant="text" className="h-8 w-20 bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Data Table Container Skeleton */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" className="h-6 w-44 bg-gray-200" />
          <Skeleton variant="text" className="h-8 w-32 rounded-lg bg-gray-100" />
        </div>

        {/* Table Rows */}
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="space-y-1">
                <Skeleton variant="text" className="h-4.5 w-48 bg-gray-200" />
                <Skeleton variant="text" className="h-3.5 w-32 bg-gray-100" />
              </div>
              <Skeleton variant="text" className="h-6 w-20 rounded-full bg-gray-100" />
              <Skeleton variant="text" className="h-4.5 w-24 bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
