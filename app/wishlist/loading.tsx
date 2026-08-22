import { Skeleton } from "@/src/components/atoms/Skeleton";

export default function WishlistLoading() {
  return (
    <div className="container-app py-8 w-full animate-pulse space-y-6">
      {/* Title Header */}
      <Skeleton variant="text" className="h-9 w-40 bg-gray-200" />

      {/* Tab Pills */}
      <div className="flex gap-3 border-b border-gray-200 pb-4">
        <Skeleton variant="rectangular" className="h-10 w-32 rounded-full bg-gray-200" />
        <Skeleton variant="rectangular" className="h-10 w-28 rounded-full bg-gray-100" />
      </div>

      {/* Saved Items Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton variant="card" className="aspect-square w-full rounded-xl bg-gray-200" />
            <Skeleton variant="text" className="h-4.5 w-3/4 bg-gray-200" />
            <Skeleton variant="text" className="h-3.5 w-1/2 bg-gray-100" />
            <Skeleton variant="text" className="h-4 w-1/4 bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
