"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/atoms/Button";
import { HiExclamationTriangle } from "react-icons/hi2";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an analytics or error tracking service
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="p-4 bg-rausch/10 text-rausch rounded-full mb-6 animate-pulse">
        <HiExclamationTriangle className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-ink tracking-tight mb-2">Unexpected Atoll Error</h1>
      <p className="text-sm text-gray-500 max-w-sm mb-8">
        A system error occurred while rendering this page. Our team has been notified.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="primary" onClick={() => reset()}>
          Reload Page
        </Button>
        <a href="/" className="inline-block">
          <Button variant="outline">Back to Home</Button>
        </a>
      </div>
    </div>
  );
}

