import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  toggleItem: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (id) => {
        const exists = get().items.includes(id);
        if (exists) {
          set({ items: get().items.filter((i) => i !== id) });
        } else {
          set({ items: [...get().items, id] });
        }
      },
      isWishlisted: (id) => get().items.includes(id),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: "kb-wishlist" }
  )
);
