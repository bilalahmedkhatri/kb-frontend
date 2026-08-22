"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/api";
import { useOrders } from "@/src/hooks/useOrders";
import { useProducts } from "@/src/hooks/useProducts";

/** Reviews for a product or stay. */
export function useReviews(
  targetId: string | undefined,
  targetType: "product" | "stay",
  enabled = true
) {
  return useQuery({
    queryKey: ["reviews", targetType, targetId],
    queryFn: () => api.getReviews(targetId!, targetType),
    enabled: Boolean(targetId) && enabled,
  });
}

/**
 * Reviews written by the current user plus purchased-but-unreviewed products
 * (the "Pending Reviews" tab data).
 */
export function useUserReviews(userId?: string, enabled = Boolean(userId)) {
  const ordersQuery = useOrders(userId, enabled);
  const productsQuery = useProducts({ pageSize: 50, enabled });

  return useQuery({
    queryKey: ["reviews", "user", userId],
    queryFn: async () => {
      const productIds = Array.from(
        new Set<string>(productsQuery.data?.data.map((p) => p.id) ?? [])
      );
      const reviewArrays = await Promise.all(
        productIds.map((pid: string) => api.getReviews(pid, "product"))
      );
      const flat = reviewArrays.flat();
      const userReviews = flat.filter((r) => r.userId === userId);
      const reviewedIds = new Set(userReviews.map((r) => r.targetId));

      const purchasedProductIds = new Set(
        (ordersQuery.data ?? []).flatMap((o) => o.items.map((i) => i.productId))
      );

      const toReviewItems = (productsQuery.data?.data ?? []).filter(
        (p) => purchasedProductIds.has(p.id) && !reviewedIds.has(p.id)
      );

      return { reviews: userReviews, toReviewItems };
    },
    enabled,
  });
}
