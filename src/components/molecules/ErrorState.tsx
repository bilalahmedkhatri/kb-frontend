"use client";

import { Button } from "@/src/components/atoms/Button";
import { cn } from "@/src/lib/utils";
import { HiExclamationTriangle } from "react-icons/hi2";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isLoading?: boolean;
  variant?: "full" | "compact" | "card";
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't retrieve this information. Please check your network connection and try again.",
  onRetry,
  isLoading = false,
  variant = "card",
  className,
}: ErrorStateProps) {
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-col items-center justify-center p-6 text-center rounded-xl border border-gray-200 bg-gray-50/50", className)}>
        <div className="flex items-center gap-2 text-xs font-bold text-rausch mb-1">
          <HiExclamationTriangle className="h-4 w-4 shrink-0" />
          <span>{title}</span>
        </div>
        {description && <p className="text-[11px] text-gray-500 mb-3">{description}</p>}
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} isLoading={isLoading} className="text-xs py-1 h-8">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center rounded-2xl border border-gray-200 bg-gray-50/50 max-w-md mx-auto my-8 p-8",
      variant === "full" ? "py-20 min-h-[50vh]" : "py-12 px-4",
      className
    )}>
      <div className="p-3 bg-rose-50 text-rausch rounded-full mb-4">
        <HiExclamationTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-ink mb-1">{title}</h3>
      <p className="text-xs text-gray-500 max-w-xs mb-6 leading-relaxed">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} isLoading={isLoading}>
          Try Again
        </Button>
      )}
    </div>
  );
}

