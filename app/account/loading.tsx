import { Skeleton } from "@/src/components/atoms/Skeleton";

export default function AccountLoading() {
  return (
    <div className="container-app py-8 w-full animate-pulse">
      {/* Account Page Title */}
      <Skeleton variant="text" className="mb-6 h-9 w-48 bg-gray-200" />

      {/* Account 2-Column Split: Sidebar + Content */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Nav Sidebar (3 Columns) */}
        <div className="md:col-span-3 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-11 w-full rounded-xl bg-gray-100" />
          ))}
        </div>

        {/* Right Main Content Panel (9 Columns) */}
        <div className="md:col-span-9 space-y-6">
          {/* Card Section 1 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
            <Skeleton variant="text" className="h-6 w-40 bg-gray-200" />
            <div className="space-y-3">
              <Skeleton variant="text" className="h-4 w-full bg-gray-100" />
              <Skeleton variant="text" className="h-4 w-3/4 bg-gray-100" />
            </div>
          </div>

          {/* Card Section 2 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
            <Skeleton variant="text" className="h-6 w-48 bg-gray-200" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton variant="rectangular" className="h-20 w-full rounded-xl bg-gray-100" />
              <Skeleton variant="rectangular" className="h-20 w-full rounded-xl bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
