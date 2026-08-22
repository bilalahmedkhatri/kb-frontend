"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import type { FilterState } from "@/src/types";

export interface GuideQueryParams {
  page?: number;
  pageSize?: number;
  filters?: Partial<FilterState>;
  enabled?: boolean;
}

/** Paginated guides query (guides index + search). */
export function useGuides(params: GuideQueryParams = {}) {
  const { page = 1, pageSize = 10, filters, enabled = true } = params;
  return useQuery({
    queryKey: ["guides", "page", page, pageSize, filters],
    queryFn: () => api.getGuides({ page, pageSize, filters }),
    enabled,
  });
}

/** Single guide query by slug. */
export function useGuide(slug: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["guide", slug],
    queryFn: () => api.getGuide(slug!),
    enabled: Boolean(slug) && enabled,
  });
}

/** Homepage featured guides rail query. */
export function useFeaturedGuides() {
  return useQuery({
    queryKey: ["guides", "featured"],
    queryFn: () => api.getFeaturedGuides(),
  });
}
