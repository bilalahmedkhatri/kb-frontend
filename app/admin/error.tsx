"use client";

import { useEffect } from "react";
import { ErrorState } from "@/src/components/molecules/ErrorState";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin portal runtime error:", error);
  }, [error]);

  return (
    <div className="py-12">
      <ErrorState
        variant="full"
        title="Admin Portal Error"
        description="An error occurred in platform moderation. Please try reloading this section."
        onRetry={reset}
      />
    </div>
  );
}
