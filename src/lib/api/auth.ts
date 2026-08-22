import { apiClient } from './client';
import type { User } from '@/src/types';

export interface BackendUser {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  full_name?: string;
  role: string;
  phone?: string;
  whatsapp?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export function mapBackendUserToFrontend(bu: BackendUser): User {
  return {
    id: bu.id,
    email: bu.email,
    name: bu.full_name || bu.email.split('@')[0],
    avatar: bu.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    role: (bu.role as any) || 'customer',
    location: 'Kiribati',
    createdAt: bu.created_at || new Date().toISOString(),
  };
}

export const authApi = {
  async login(username: string, password: string): Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/login/access-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!res.ok) {
      throw new Error('Invalid email or password');
    }

    const token: TokenResponse = await res.json();
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token.access_token);
    }
    return token;
  },

  async register(data: { email: string; password: string; full_name?: string; role?: string }): Promise<User> {
    const bu = await apiClient<BackendUser>('/users/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return mapBackendUserToFrontend(bu);
  },

  async getMe(token?: string): Promise<User> {
    const bu = await apiClient<BackendUser>('/users/me', { token });
    return mapBackendUserToFrontend(bu);
  },

  async updateMe(data: Partial<BackendUser>, token?: string): Promise<User> {
    const bu = await apiClient<BackendUser>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    });
    return mapBackendUserToFrontend(bu);
  },
};
