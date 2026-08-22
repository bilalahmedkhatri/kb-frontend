import { Skeleton } from "@/src/components/atoms/Skeleton";

export default function GuideArticleLoading() {
  return (
    <div className="w-full animate-pulse">
      {/* Full-width Hero Banner Skeleton */}
      <div className="relative aspect-[21/9] w-full bg-gray-200 overflow-hidden flex items-end p-8 md:p-16">
        <div className="max-w-3xl space-y-4 w-full">
          <Skeleton variant="text" className="h-6 w-32 rounded-full bg-gray-300" />
          <Skeleton variant="text" className="h-10 w-4/5 bg-gray-300" />
          <Skeleton variant="text" className="h-5 w-2/3 bg-gray-300" />
        </div>
      </div>

      {/* Centered Editorial Content Flow */}
      <div className="container-app py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Author metadata line */}
          <div className="flex items-center gap-3 border-b border-gray-200 pb-6">
            <Skeleton variant="circular" className="h-12 w-12 rounded-full bg-gray-200" />
            <div className="space-y-1.5">
              <Skeleton variant="text" className="h-4 w-36 bg-gray-200" />
              <Skeleton variant="text" className="h-3 w-24 bg-gray-100" />
            </div>
          </div>

          {/* Paragraph blocks */}
          <div className="space-y-3">
            <Skeleton variant="text" className="h-4 w-full bg-gray-100" />
            <Skeleton variant="text" className="h-4 w-full bg-gray-100" />
            <Skeleton variant="text" className="h-4 w-4/5 bg-gray-100" />
          </div>

          {/* Blockquote callout box */}
          <Skeleton variant="rectangular" className="h-24 w-full rounded-2xl bg-gray-100 border-l-4 border-gray-300" />

          {/* Additional text */}
          <div className="space-y-3">
            <Skeleton variant="text" className="h-4 w-full bg-gray-100" />
            <Skeleton variant="text" className="h-4 w-11/12 bg-gray-100" />
            <Skeleton variant="text" className="h-4 w-3/4 bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
