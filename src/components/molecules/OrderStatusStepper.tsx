"use client";

import React from "react";
import { cn } from "@/src/lib/utils";
import type { Order } from "@/src/types";

const DEFAULT_STEPS: Order["status"][] = ["pending", "confirmed", "shipped", "delivered"];

export interface OrderStatusStepperProps {
  currentStatus: Order["status"];
  steps?: Order["status"][];
  className?: string;
}

export function OrderStatusStepper({
  currentStatus,
  steps = DEFAULT_STEPS,
  className,
}: OrderStatusStepperProps) {
  const currentStepIndex = steps.indexOf(currentStatus);

  if (currentStepIndex < 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
        className
      )}
    >
      {steps.map((step, i) => {
        const isActive = i <= currentStepIndex;
        const isLast = i < steps.length - 1;

        return (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                isActive
                  ? "bg-rausch text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                "text-sm font-medium capitalize",
                isActive ? "text-ink" : "text-gray-500"
              )}
            >
              {step}
            </span>
            {isLast && (
              <div
                className={cn(
                  "ml-2 mr-2 h-0.5 flex-1 transition-colors",
                  i < currentStepIndex ? "bg-rausch" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
