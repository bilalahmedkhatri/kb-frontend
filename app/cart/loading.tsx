import { Skeleton } from "@/src/components/atoms/Skeleton";

export default function CartLoading() {
  return (
    <div className="container-app py-8 w-full animate-pulse space-y-6">
      <Skeleton variant="text" className="h-9 w-48 bg-gray-200" />

      {/* 2-Column Split: Cart List + Order Summary */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left Cart Items List (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <Skeleton variant="card" className="h-24 w-24 shrink-0 rounded-xl bg-gray-200" />
              <div className="flex flex-1 flex-col justify-between py-1">
                <div className="space-y-1.5">
                  <Skeleton variant="text" className="h-5 w-48 bg-gray-200" />
                  <Skeleton variant="text" className="h-3.5 w-32 bg-gray-100" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton variant="text" className="h-5 w-24 bg-gray-200" />
                  <Skeleton variant="rectangular" className="h-8 w-28 rounded-lg bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sticky Order Summary Card (4 Columns) */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-gray-300 bg-white p-6 space-y-4 shadow-sm">
            <Skeleton variant="text" className="h-6 w-36 bg-gray-200" />
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <Skeleton variant="text" className="h-4 w-28 bg-gray-100" />
                <Skeleton variant="text" className="h-4 w-16 bg-gray-200" />
              </div>
              <div className="flex justify-between">
                <Skeleton variant="text" className="h-4 w-36 bg-gray-100" />
                <Skeleton variant="text" className="h-4 w-12 bg-gray-200" />
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <Skeleton variant="text" className="h-5 w-24 bg-gray-200" />
                <Skeleton variant="text" className="h-5 w-24 bg-gray-200" />
              </div>
            </div>
            <Skeleton variant="rectangular" className="h-12 w-full rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
