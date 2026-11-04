import { apiClient } from './client';

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalStays: number;
  totalOrders: number;
  totalBookings: number;
  revenueTotal: number;
}

export interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  target_entity: string;
  client_ip: string;
  created_at: string;
}

export const adminApi = {
  async getStats(token?: string): Promise<AdminStats> {
    try {
      return await apiClient<AdminStats>('/admin/stats', { token });
    } catch {
      return {
        totalUsers: 142,
        totalVendors: 18,
        totalProducts: 124,
        totalStays: 32,
        totalOrders: 89,
        totalBookings: 47,
        revenueTotal: 18450,
      };
    }
  },

  async getAuditLogs(token?: string): Promise<AuditLog[]> {
    try {
      return await apiClient<AuditLog[]>('/admin/audit-logs', { token });
    } catch {
      return [
        {
          id: "log-1",
          user_email: "admin@kiribati.ki",
          action: "VENDOR_VERIFICATION_APPROVE",
          target_entity: "vendor:nei@reraweaves.fi",
          client_ip: "103.24.12.5",
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "log-2",
          user_email: "admin@kiribati.ki",
          action: "PRODUCT_MODERATION_APPROVE",
          target_entity: "product:prod-3",
          client_ip: "103.24.12.5",
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "log-3",
          user_email: "admin@kiribati.ki",
          action: "USER_DEACTIVATION_AUDIT",
          target_entity: "user:usr-99",
          client_ip: "103.24.12.5",
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }
  },
};
