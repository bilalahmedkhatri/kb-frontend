"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";

/** Vendor profile query. */
export function useVendor(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["vendor", id],
    queryFn: () => api.getVendor(id!),
    enabled: Boolean(id) && enabled,
  });
}

/** Products belonging to a vendor. */
export function useVendorProducts(vendorId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["vendor", vendorId, "products"],
    queryFn: () => api.getVendorProducts(vendorId!),
    enabled: Boolean(vendorId) && enabled,
  });
}
