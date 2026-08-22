"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import type { FilterState, PaginatedResponse, Product } from "@/src/types";

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  filters?: Partial<FilterState>;
  enabled?: boolean;
  initialData?: PaginatedResponse<Product>;
}

/** Paginated product query (marketplace, category, search feeds). */
export function useProducts(params: ProductQueryParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    filters,
    enabled = true,
    initialData,
  } = params;
  return useQuery({
    queryKey: ["products", "page", page, pageSize, filters],
    queryFn: () => api.getProducts({ page, pageSize, filters }),
    enabled,
    initialData,
  });
}

/** Infinite product feed for mobile category infinite scroll. */
export function useInfiniteProducts(params: Omit<ProductQueryParams, "page"> = {}) {
  const { pageSize = 12, filters, enabled = true } = params;
  return useInfiniteQuery({
    queryKey: ["products", "infinite", pageSize, filters],
    queryFn: ({ pageParam }) =>
      api.getProducts({ page: pageParam, pageSize, filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResponse<Product>) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled,
  });
}

/** Single product detail query. */
export function useProduct(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id!),
    enabled: Boolean(id) && enabled,
  });
}

/** Homepage featured rail query. */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => api.getFeaturedProducts(),
  });
}
