import { Spinner } from "@/src/components/atoms/Spinner";
import { Skeleton } from "@/src/components/atoms/Skeleton";

export default function Loading() {
  return (
    <div className="container-app py-8 w-full">
      {/* Page Title & Category Tabs Skeleton */}
      <div className="mb-8 space-y-4">
        <Skeleton variant="text" className="h-10 w-48 bg-gray-200" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              className="h-9 w-24 rounded-full bg-gray-100"
            />
          ))}
        </div>
      </div>

      {/* Grid of Card Skeletons */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            {/* Image Skeleton */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
              <Skeleton
                variant="card"
                className="h-full w-full bg-gray-200"
              />
              {/* A subtle spinner in the center of the loading view */}
              {i === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
                  <Spinner size="lg" className="text-rausch" />
                </div>
              )}
            </div>
            {/* Title & Metadata Skeletons */}
            <div className="space-y-2">
              <Skeleton variant="text" className="h-4.5 w-3/4 bg-gray-200" />
              <Skeleton variant="text" className="h-3.5 w-1/2 bg-gray-100" />
              <Skeleton variant="text" className="h-4 w-1/4 bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
