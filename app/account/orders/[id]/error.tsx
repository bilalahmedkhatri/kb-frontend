"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HiExclamationTriangle, HiArrowLeft, HiArrowPath } from "react-icons/hi2";

export default function OrderDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Order details page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <HiExclamationTriangle className="h-8 w-8" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-ink">Failed to Load Order Details</h2>
      <p className="mb-6 max-w-md text-sm text-gray-500">
        An unexpected error occurred while loading this order. Please try again or return to your order history.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black"
        >
          <HiArrowPath className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gray-50"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>
    </div>
  );
}
