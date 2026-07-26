"use client";

import React from "react";
import Image from "next/image";
import { cn, formatCurrency } from "@/src/lib/utils";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface OrderItemRowProps {
  item: OrderItem;
  currency?: string;
  className?: string;
}

export function OrderItemRow({
  item,
  currency = "USD",
  className,
}: OrderItemRowProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50",
        className
      )}
    >
      <Image
        src={item.productImage || "/placeholder.svg"}
        alt={item.productName}
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-ink">
          {item.productName}
        </p>
        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
      </div>
      <span className="text-sm font-bold text-ink shrink-0">
        {formatCurrency(lineTotal, currency)}
      </span>
    </div>
  );
}
