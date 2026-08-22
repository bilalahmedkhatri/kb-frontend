import { Skeleton } from "@/src/components/atoms/Skeleton";

export default function AdminLoading() {
  return (
    <div className="container-app py-8 w-full animate-pulse space-y-8">
      {/* Admin Moderation Header Skeleton */}
      <div className="space-y-2 border-b border-gray-200 pb-6">
        <Skeleton variant="text" className="h-8 w-72 bg-gray-200" />
        <Skeleton variant="text" className="h-4 w-96 max-w-full bg-gray-100" />
      </div>

      {/* Admin Stats Overview Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-2 shadow-sm">
            <Skeleton variant="text" className="h-4 w-32 bg-gray-100" />
            <Skeleton variant="text" className="h-8 w-24 bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Moderation Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Skeleton variant="rectangular" className="h-10 w-full sm:w-80 rounded-xl bg-gray-100" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-8 w-20 rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="space-y-1.5 flex-1">
              <Skeleton variant="text" className="h-4.5 w-56 bg-gray-200" />
              <Skeleton variant="text" className="h-3.5 w-36 bg-gray-100" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton variant="text" className="h-6 w-24 rounded-full bg-gray-100" />
              <Skeleton variant="rectangular" className="h-8 w-20 rounded-lg bg-gray-200" />
              <Skeleton variant="rectangular" className="h-8 w-20 rounded-lg bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
