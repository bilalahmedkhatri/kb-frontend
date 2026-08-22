"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import type { FilterState, Stay } from "@/src/types";

export interface StayQueryParams {
  page?: number;
  pageSize?: number;
  filters?: Partial<FilterState>;
  enabled?: boolean;
}

/** Paginated stays query (stays listing feed). */
export function useStays(params: StayQueryParams = {}) {
  const { page = 1, pageSize = 10, filters, enabled = true } = params;
  return useQuery({
    queryKey: ["stays", "page", page, pageSize, filters],
    queryFn: () => api.getStays({ page, pageSize, filters }),
    enabled,
  });
}

/** Single stay detail query. */
export function useStay(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["stay", id],
    queryFn: () => api.getStay(id!),
    enabled: Boolean(id) && enabled,
  });
}

/** Homepage featured stays rail query. */
export function useFeaturedStays() {
  return useQuery({
    queryKey: ["stays", "featured"],
    queryFn: () => api.getFeaturedStays(),
  });
}
