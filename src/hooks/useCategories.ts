"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";

/** Category navigation query (homepage tab bar, category pages). */
export function useCategories(type?: string, enabled = true) {
  return useQuery({
    queryKey: ["categories", type],
    queryFn: () => api.getCategories(type),
    enabled,
  });
}
