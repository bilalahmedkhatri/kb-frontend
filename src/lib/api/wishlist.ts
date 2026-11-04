import { apiClient } from './client';
import type { Product, Stay } from '@/src/types';

export interface WishlistItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'product' | 'stay';
  product?: Product;
  stay?: Stay;
  created_at?: string;
}

export const wishlistApi = {
  async getWishlist(token?: string): Promise<WishlistItem[]> {
    return apiClient<WishlistItem[]>('/wishlist/', { token });
  },

  async addToWishlist(itemId: string, itemType: 'product' | 'stay', token?: string): Promise<WishlistItem> {
    return apiClient<WishlistItem>('/wishlist/', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, item_type: itemType }),
      token,
    });
  },

  async removeFromWishlist(itemId: string, token?: string): Promise<{ detail: string }> {
    return apiClient<{ detail: string }>(`/wishlist/${itemId}`, {
      method: 'DELETE',
      token,
    });
  },
};
