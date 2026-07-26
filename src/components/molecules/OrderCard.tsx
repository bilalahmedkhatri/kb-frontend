"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import { cn, formatCurrency } from "@/src/lib/utils";
import type { Order } from "@/src/types";

const statusVariants: Record<Order["status"], "default" | "primary" | "success" | "warning" | "error"> = {
  pending: "default",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

export interface OrderCardProps {
  order: Order;
  onViewDetails?: (order: Order) => void;
  onReorder?: (order: Order) => void;
  className?: string;
}

export function OrderCard({
  order,
  onViewDetails,
  onReorder,
  className,
}: OrderCardProps) {
  const displayItems = order.items.slice(0, 4);
  const remainingMobile = Math.max(0, order.items.length - 3);
  const remainingDesktop = Math.max(0, order.items.length - 4);

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
        <div>
          <p className="text-sm font-bold text-ink">Order #{order.id}</p>
          <p className="text-xs text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariants[order.status] || "default"} className="capitalize">
            {order.status}
          </Badge>
          <span className="text-sm font-bold text-ink">
            {formatCurrency(order.total, order.currency)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Interactive Thumbnails Group */}
        <div
          onClick={() => onViewDetails?.(order)}
          className={cn(
            "flex items-center gap-2",
            onViewDetails && "cursor-pointer group/thumbs hover:opacity-90 transition-opacity"
          )}
          title={onViewDetails ? "Click to view order details" : undefined}
        >
          {displayItems.map((item, index) => (
            <div
              key={`${item.productId}-${index}`}
              className={cn(
                "relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 transition-transform group-hover/thumbs:scale-105",
                index === 3 && "hidden md:block"
              )}
            >
              <Image
                src={item.productImage || "/placeholder.svg"}
                alt={item.productName}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {remainingMobile > 0 && (
            <span className="text-xs font-medium text-gray-500 md:hidden">
              +{remainingMobile} more
            </span>
          )}
          {remainingDesktop > 0 && (
            <span className="hidden text-xs font-medium text-gray-500 md:inline">
              +{remainingDesktop} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          {onReorder && (
            <button
              onClick={() => onReorder(order)}
              className="w-full rounded-lg border border-[#222222] bg-white px-3 py-1.5 text-sm font-semibold text-[#222222] transition-colors hover:bg-[#F7F7F7] sm:w-auto sm:px-4 sm:py-2 sm:text-base"
            >
              Reorder
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(order)}
              className="w-full rounded-lg bg-[#FF385C] px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#E31C5F] sm:w-auto sm:px-4 sm:py-2 sm:text-base"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
