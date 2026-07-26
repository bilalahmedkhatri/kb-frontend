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
  const displayItems = order.items.slice(0, 3);
  const remainingCount = Math.max(0, order.items.length - 3);

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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {displayItems.map((item) => (
            <div
              key={item.productId}
              className="relative h-12 w-12 overflow-hidden rounded-lg border border-gray-200"
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
          {remainingCount > 0 && (
            <span className="text-xs font-medium text-gray-500">
              +{remainingCount} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onReorder && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReorder(order)}
            >
              Reorder
            </Button>
          )}
          {onViewDetails && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onViewDetails(order)}
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
