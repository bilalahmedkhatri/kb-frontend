"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";

/** Orders for the current user (or all orders for workspace pages). */
export function useOrders(userId?: string, enabled = true) {
  return useQuery({
    queryKey: ["orders", userId ?? "all"],
    queryFn: () => api.getOrders(userId),
    enabled,
  });
}

/** Single order by id. */
export function useOrder(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => api.getOrder(id!),
    enabled: Boolean(id) && enabled,
  });
}
