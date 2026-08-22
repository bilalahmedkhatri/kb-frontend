import { productsApi } from './products';
import { staysApi } from './stays';
import { ordersApi } from './orders';
import { bookingsApi } from './bookings';
import { reviewsApi } from './reviews';
import { conversationsApi } from './conversations';
import { authApi } from './auth';

import { categories as mockCategories } from '@/src/data/categories';
import { guides as mockGuides } from '@/src/data/guides';
import type { Category, Guide, PaginatedResponse, FilterState } from '@/src/types';

export * from './client';
export * from './products';
export * from './stays';
export * from './orders';
export * from './bookings';
export * from './reviews';
export * from './conversations';
export * from './auth';

/**
 * Unified API Client Interface bridging all dedicated endpoint modules.
 */
export const api = {
  // Categories
  async getCategories(type?: string): Promise<Category[]> {
    if (type) return mockCategories.filter((c) => c.type === type);
    return mockCategories;
  },

  // Products
  getProducts: productsApi.getProducts,
  getProduct: productsApi.getProduct,
  getFeaturedProducts: async () => (await productsApi.getProducts({ pageSize: 8 })).data,

  // Stays
  getStays: staysApi.getStays,
  getStay: staysApi.getStay,
  getFeaturedStays: async () => (await staysApi.getStays({ pageSize: 8 })).data,

  // Guides
  async getGuides(params?: { page?: number; pageSize?: number; filters?: Partial<FilterState> }): Promise<PaginatedResponse<Guide>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const totalPages = Math.ceil(mockGuides.length / pageSize) || 1;
    return {
      data: mockGuides.slice((page - 1) * pageSize, page * pageSize),
      total: mockGuides.length,
      page,
      pageSize,
      totalPages,
      hasMore: page < totalPages,
    };
  },
  async getGuide(slug: string): Promise<Guide | undefined> {
    return mockGuides.find((g) => g.slug === slug);
  },
  async getFeaturedGuides(): Promise<Guide[]> {
    return mockGuides.filter((g) => g.featured).slice(0, 4);
  },

  // Vendors
  async getVendor(id: string) {
    return authApi.getMe();
  },
  async getVendorProducts(vendorId: string) {
    return (await productsApi.getProducts({ pageSize: 50 })).data;
  },

  // Orders
  getOrders: ordersApi.getMyOrders,
  getOrder: ordersApi.getOrder,

  // Bookings
  getBookings: bookingsApi.getMyBookings,

  // Reviews
  getReviews: reviewsApi.getTargetReviews,

  // Auth
  getUser: authApi.getMe,
};
