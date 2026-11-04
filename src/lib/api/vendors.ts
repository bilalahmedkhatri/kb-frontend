import { apiClient } from './client';

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_description?: string;
  contact_phone?: string;
  business_address?: string;
  verification_status: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorProfileUpdate {
  business_name?: string;
  business_description?: string;
  contact_phone?: string;
  business_address?: string;
}

export interface VendorRegisterData {
  email: string;
  password: string;
  full_name?: string;
  business_name: string;
  business_description?: string;
  contact_phone?: string;
  business_address?: string;
}

export const vendorsApi = {
  async registerVendor(data: VendorRegisterData): Promise<VendorProfile> {
    return apiClient<VendorProfile>('/vendors/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyProfile(): Promise<VendorProfile> {
    return apiClient<VendorProfile>('/vendors/me');
  },

  async updateMyProfile(data: VendorProfileUpdate): Promise<VendorProfile> {
    return apiClient<VendorProfile>('/vendors/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

