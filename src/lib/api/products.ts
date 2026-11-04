import { apiClient } from './client';
import type { Product, PaginatedResponse, FilterState } from '@/src/types';

export interface BackendProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  origin_island: string;
  material?: string;
  stock: number;
  status: string;
  images: string[];
  vendor_id: string;
  created_at?: string;
  updated_at?: string;
}

export function mapBackendProductToFrontend(bp: BackendProduct): Product {
  const validImages = (Array.isArray(bp.images) ? bp.images : []).filter(
    (img) => typeof img === 'string' && !img.startsWith('blob:')
  );
  if (validImages.length === 0 && bp.images && bp.images.length > 0) {
    validImages.push('https://images.unsplash.com/photo-1606744888344-498238f01740?w=800&auto=format&fit=crop&q=80');
  }

  return {
    id: bp.id,
    name: bp.name,
    description: bp.description,
    price: bp.price,
    currency: bp.currency || 'AUD',
    category: bp.category,
    origin: bp.origin_island,
    material: bp.material || '',
    stock: bp.stock,
    status: (bp.status as any) || 'active',
    images: validImages,
    vendorId: bp.vendor_id,
    vendorName: 'Kiribati Artisan',
    rating: 4.8,
    reviewCount: 12,
    createdAt: bp.created_at || new Date().toISOString(),
  };
}

export const productsApi = {
  async getProducts(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    island?: string;
    status?: string;
    vendorId?: string;
    filters?: Partial<FilterState>;
  }): Promise<PaginatedResponse<Product>> {
    const skip = ((params?.page ?? 1) - 1) * (params?.pageSize ?? 10);
    const limit = params?.pageSize ?? 10;

    let effectiveStatus: string | undefined = undefined;
    if (params?.status) {
      if (params.status !== 'all') {
        effectiveStatus = params.status;
      }
    } else if (params?.filters?.status) {
      if (params.filters.status !== 'all') {
        effectiveStatus = params.filters.status;
      }
    } else if (!params?.vendorId && !params?.filters?.vendorId) {
      // Public marketplace storefront defaults to active
      effectiveStatus = 'active';
    }

    const effectiveVendorId = params?.vendorId || params?.filters?.vendorId;

    const res = await apiClient<{ data: BackendProduct[]; count: number }>('/products/', {
      params: {
        skip,
        limit,
        category: params?.category || params?.filters?.categories?.[0],
        island: params?.island || params?.filters?.island,
        status: effectiveStatus,
        vendor_id: effectiveVendorId,
      },
    });

    const data = (res.data || []).map(mapBackendProductToFrontend);
    const total = res.count || data.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const page = params?.page ?? 1;

    return {
      data,
      total,
      page,
      pageSize: limit,
      totalPages,
      hasMore: page < totalPages,
    };
  },

  async getProduct(id: string): Promise<Product> {
    const bp = await apiClient<BackendProduct>(`/products/${id}`);
    return mapBackendProductToFrontend(bp);
  },

  async createProduct(data: Partial<BackendProduct>, token?: string): Promise<Product> {
    const bp = await apiClient<BackendProduct>('/products/', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
    return mapBackendProductToFrontend(bp);
  },

  async updateProduct(id: string, data: Partial<BackendProduct>, token?: string): Promise<Product> {
    const bp = await apiClient<BackendProduct>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
    return mapBackendProductToFrontend(bp);
  },

  async deleteProduct(id: string, token?: string): Promise<{ detail: string }> {
    return apiClient<{ detail: string }>(`/products/${id}`, {
      method: 'DELETE',
      token,
    });
  },
};
