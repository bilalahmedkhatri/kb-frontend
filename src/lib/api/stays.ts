import { apiClient } from './client';
import type { Stay, PaginatedResponse, FilterState } from '@/src/types';

export interface BackendStay {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  currency: string;
  type: string;
  location: string;
  island: string;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  status: string;
  images: string[];
  host_id: string;
  created_at?: string;
  updated_at?: string;
}

export function mapBackendStayToFrontend(bs: BackendStay): Stay {
  return {
    id: bs.id,
    name: bs.name,
    description: bs.description,
    pricePerNight: bs.price_per_night,
    currency: bs.currency || 'AUD',
    type: (bs.type as any) || 'eco-lodge',
    location: bs.location,
    island: bs.island,
    maxGuests: bs.max_guests,
    bedrooms: bs.bedrooms,
    beds: bs.beds,
    bathrooms: bs.bathrooms,
    amenities: Array.isArray(bs.amenities) ? bs.amenities : [],
    status: (bs.status as any) || 'active',
    images: Array.isArray(bs.images) ? bs.images : [],
    hostId: bs.host_id,
    hostName: 'Kiribati Host',
    rating: 4.9,
    reviewCount: 8,
    createdAt: bs.created_at || new Date().toISOString(),
  };
}

export const staysApi = {
  async getStays(params?: {
    page?: number;
    pageSize?: number;
    island?: string;
    type?: string;
    status?: string;
    filters?: Partial<FilterState>;
  }): Promise<PaginatedResponse<Stay>> {
    const skip = ((params?.page ?? 1) - 1) * (params?.pageSize ?? 10);
    const limit = params?.pageSize ?? 10;

    const res = await apiClient<{ data: BackendStay[]; count: number }>('/stays/', {
      params: {
        skip,
        limit,
        island: params?.island || params?.filters?.island,
        type: params?.type || params?.filters?.type,
        status: params?.status || 'active',
      },
    });

    const data = (res.data || []).map(mapBackendStayToFrontend);
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

  async getStay(id: string): Promise<Stay> {
    const bs = await apiClient<BackendStay>(`/stays/${id}`);
    return mapBackendStayToFrontend(bs);
  },

  async createStay(data: Partial<BackendStay>, token?: string): Promise<Stay> {
    const bs = await apiClient<BackendStay>('/stays/', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
    return mapBackendStayToFrontend(bs);
  },

  async updateStay(id: string, data: Partial<BackendStay>, token?: string): Promise<Stay> {
    const bs = await apiClient<BackendStay>(`/stays/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
    return mapBackendStayToFrontend(bs);
  },

  async deleteStay(id: string, token?: string): Promise<{ detail: string }> {
    return apiClient<{ detail: string }>(`/stays/${id}`, {
      method: 'DELETE',
      token,
    });
  },
};
