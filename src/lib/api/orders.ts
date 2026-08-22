import { apiClient } from './client';
import type { Order, OrderItem } from '@/src/types';

export interface BackendOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface BackendOrder {
  id: string;
  user_id: string;
  total: number;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  currency: string;
  status: string;
  shipping_address: any;
  tracking_number?: string;
  created_at?: string;
  updated_at?: string;
  items?: BackendOrderItem[];
}

export function mapBackendOrderToFrontend(bo: BackendOrder): Order {
  const items: OrderItem[] = (bo.items || []).map((item) => ({
    productId: item.product_id,
    productName: item.name,
    productImage: item.image || '',
    price: item.price,
    quantity: item.quantity,
  }));

  return {
    id: bo.id,
    userId: bo.user_id,
    items,
    total: bo.total,
    currency: bo.currency || 'AUD',
    status: (bo.status as any) || 'pending',
    shippingAddress: {
      fullName: bo.shipping_address?.fullName || 'Customer',
      street: bo.shipping_address?.street || '',
      city: bo.shipping_address?.city || '',
      state: bo.shipping_address?.state || '',
      zip: bo.shipping_address?.postcode || bo.shipping_address?.zip || '',
      country: bo.shipping_address?.country || 'Australia',
      phone: bo.shipping_address?.phone || '',
    },
    deliveryFee: bo.delivery_fee,
    createdAt: bo.created_at || new Date().toISOString(),
    updatedAt: bo.updated_at || new Date().toISOString(),
  };
}

export const ordersApi = {
  async getMyOrders(token?: string): Promise<Order[]> {
    const data = await apiClient<BackendOrder[]>('/orders/me', { token });
    return (data || []).map(mapBackendOrderToFrontend);
  },

  async getOrder(id: string, token?: string): Promise<Order> {
    const bo = await apiClient<BackendOrder>(`/orders/${id}`, { token });
    return mapBackendOrderToFrontend(bo);
  },

  async createOrder(data: {
    items: { product_id: string; name: string; price: number; quantity: number; image?: string }[];
    shipping_address: any;
  }, token?: string): Promise<Order> {
    const bo = await apiClient<BackendOrder>('/orders/', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
    return mapBackendOrderToFrontend(bo);
  },

  async updateOrderStatus(id: string, status: string, token?: string): Promise<Order> {
    const bo = await apiClient<BackendOrder>(`/orders/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH',
      token,
    });
    return mapBackendOrderToFrontend(bo);
  },
};
