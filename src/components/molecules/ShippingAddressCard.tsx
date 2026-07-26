"use client";

import React from "react";
import { HiMapPin } from "react-icons/hi2";
import { cn } from "@/src/lib/utils";

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface ShippingAddressCardProps {
  address: ShippingAddress;
  title?: string;
  onEdit?: () => void;
  className?: string;
}

export function ShippingAddressCard({
  address,
  title = "Shipping Address",
  onEdit,
  className,
}: ShippingAddressCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <HiMapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
          <div>
            <h3 className="mb-1 text-sm font-semibold text-ink">{title}</h3>
            <p className="text-sm text-gray-700">{address.fullName}</p>
            <p className="text-sm text-gray-500">{address.street}</p>
            <p className="text-sm text-gray-500">
              {address.city}, {address.state} {address.zip}
            </p>
            <p className="text-sm text-gray-500">{address.country}</p>
            <p className="text-sm text-gray-500">{address.phone}</p>
          </div>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-semibold text-rausch hover:underline"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
