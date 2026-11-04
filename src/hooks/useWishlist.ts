"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi, WishlistItem } from "@/src/lib/api/wishlist";

export function useWishlist() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistApi.getWishlist(),
  });

  const addMutation = useMutation({
    mutationFn: ({ itemId, itemType }: { itemId: string; itemType: "product" | "stay" }) =>
      wishlistApi.addToWishlist(itemId, itemType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => wishlistApi.removeFromWishlist(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const toggleWishlist = (itemId: string, itemType: "product" | "stay" = "product") => {
    const items = query.data || [];
    const exists = items.some((i) => i.item_id === itemId);
    if (exists) {
      removeMutation.mutate(itemId);
    } else {
      addMutation.mutate({ itemId, itemType });
    }
  };

  const isWishlisted = (itemId: string): boolean => {
    const items = query.data || [];
    return items.some((i) => i.item_id === itemId);
  };

  return {
    ...query,
    toggleWishlist,
    isWishlisted,
    isMutating: addMutation.isPending || removeMutation.isPending,
  };
}
