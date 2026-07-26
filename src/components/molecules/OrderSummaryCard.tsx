"use client";

import React from "react";
import { cn, formatCurrency } from "@/src/lib/utils";

export interface OrderSummaryCardProps {
  subtotal: number;
  shipping?: number;
  total: number;
  currency?: string;
  title?: string;
  className?: string;
}

export function OrderSummaryCard({
  subtotal,
  shipping = 0,
  total,
  currency = "USD",
  title = "Order Summary",
  className,
}: OrderSummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
        className
      )}
    >
      <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? "Free" : formatCurrency(shipping, currency)}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-ink">
          <span>Total</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
      </div>
    </div>
  );
}
