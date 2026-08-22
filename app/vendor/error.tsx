"use client";

import { useEffect } from "react";
import { ErrorState } from "@/src/components/molecules/ErrorState";

export default function VendorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Vendor portal runtime error:", error);
  }, [error]);

  return (
    <div className="py-12">
      <ErrorState
        variant="full"
        title="Vendor Dashboard Error"
        description="An error occurred while loading vendor data. Please try reloading this section."
        onRetry={reset}
      />
    </div>
  );
}
