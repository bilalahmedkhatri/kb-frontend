import { apiClient } from './client';
import type { Booking } from '@/src/types';

export interface BackendBooking {
  id: string;
  user_id: string;
  stay_id: string;
  check_in: string;
  check_out: string;
  guest_count: number;
  status: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
}

export function mapBackendBookingToFrontend(bb: BackendBooking): Booking {
  return {
    id: bb.id,
    stayId: bb.stay_id,
    stayName: 'Kiribati Island Stay',
    userId: bb.user_id,
    checkIn: bb.check_in,
    checkOut: bb.check_out,
    guests: bb.guest_count,
    total: 0,
    status: (bb.status as any) || 'pending',
    createdAt: bb.created_at || new Date().toISOString(),
  };
}

export const bookingsApi = {
  async getMyBookings(token?: string): Promise<Booking[]> {
    const data = await apiClient<BackendBooking[]>('/bookings/me', { token });
    return (data || []).map(mapBackendBookingToFrontend);
  },

  async getStayBookings(stayId: string, token?: string): Promise<Booking[]> {
    const data = await apiClient<BackendBooking[]>(`/bookings/stay/${stayId}`, { token });
    return (data || []).map(mapBackendBookingToFrontend);
  },

  async createBooking(data: {
    stay_id: string;
    check_in: string;
    check_out: string;
    guest_count: number;
    message?: string;
  }, token?: string): Promise<Booking> {
    const bb = await apiClient<BackendBooking>('/bookings/', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
    return mapBackendBookingToFrontend(bb);
  },

  async updateBookingStatus(id: string, status: string, token?: string): Promise<Booking> {
    const bb = await apiClient<BackendBooking>(`/bookings/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH',
      token,
    });
    return mapBackendBookingToFrontend(bb);
  },
};
