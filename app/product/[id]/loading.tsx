import { Skeleton } from "@/src/components/atoms/Skeleton";

export default function ProductLoading() {
  return (
    <div className="container-app py-8 w-full animate-pulse">
      {/* 1. Header Title & Meta Skeleton */}
      <div className="mb-6 space-y-3">
        <Skeleton variant="text" className="h-8 w-2/3 md:w-1/2 bg-gray-200" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton variant="text" className="h-4 w-24 bg-gray-200" />
            <Skeleton variant="text" className="h-4 w-36 bg-gray-100" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="text" className="h-8 w-20 rounded-lg bg-gray-100" />
            <Skeleton variant="text" className="h-8 w-20 rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>

      {/* 2. 10-Photo Mosaic Gallery Skeleton */}
      <div className="mb-10 hidden md:block overflow-hidden rounded-2xl border border-gray-200">
        <div className="grid grid-cols-5 gap-2 aspect-[2.5/1]">
          {/* Main Hero Photo (Left 2 cols) */}
          <div className="col-span-2 relative h-full">
            <Skeleton variant="card" className="h-full w-full rounded-none bg-gray-200" />
          </div>
          {/* 8 Grid Photos (Right 3 cols in 2 rows of 4) */}
          <div className="col-span-3 grid grid-cols-4 gap-2 h-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-full w-full rounded-none bg-gray-100" />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Single Photo Carousel Skeleton */}
      <div className="mb-10 block md:hidden aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden">
        <Skeleton variant="card" className="h-full w-full bg-gray-200" />
      </div>

      {/* 3. Main 2-Column Split Section */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Content (8 Columns) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Creator & Guild Summary */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="space-y-2">
              <Skeleton variant="text" className="h-6 w-64 bg-gray-200" />
              <Skeleton variant="text" className="h-4 w-40 bg-gray-100" />
            </div>
            <Skeleton variant="circular" className="h-14 w-14 rounded-full bg-gray-200" />
          </div>

          {/* Highlights */}
          <div className="space-y-4 border-b border-gray-200 pb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton variant="circular" className="h-6 w-6 shrink-0 bg-gray-200" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton variant="text" className="h-4 w-48 bg-gray-200" />
                  <Skeleton variant="text" className="h-3 w-3/4 bg-gray-100" />
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="border-b border-gray-200 pb-6 space-y-3">
            <Skeleton variant="text" className="h-5 w-36 bg-gray-200" />
            <Skeleton variant="text" className="h-4 w-full bg-gray-100" />
            <Skeleton variant="text" className="h-4 w-5/6 bg-gray-100" />
            <Skeleton variant="text" className="h-4 w-4/6 bg-gray-100" />
          </div>
        </div>

        {/* Right Sticky Floating Purchase Card (4 Columns) */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-gray-300 bg-white p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-baseline">
              <Skeleton variant="text" className="h-8 w-32 bg-gray-200" />
              <Skeleton variant="text" className="h-4 w-16 bg-gray-100" />
            </div>
            <Skeleton variant="rectangular" className="h-16 w-full rounded-xl bg-gray-100" />
            <Skeleton variant="rectangular" className="h-12 w-full rounded-xl bg-gray-200" />
            <Skeleton variant="rectangular" className="h-10 w-full rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
