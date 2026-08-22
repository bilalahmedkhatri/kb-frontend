"use client";

import { useEffect } from "react";
import { ErrorState } from "@/src/components/molecules/ErrorState";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Account section runtime error:", error);
  }, [error]);

  return (
    <div className="py-12">
      <ErrorState
        variant="full"
        title="Account Area Error"
        description="An error occurred while loading your account information. Please try reloading this section."
        onRetry={reset}
      />
    </div>
  );
}
