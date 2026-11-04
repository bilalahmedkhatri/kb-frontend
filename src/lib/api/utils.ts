import { apiClient } from './client';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

export const utilsApi = {
  async uploadFile(file: File, token?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        headers['Authorization'] = `Bearer ${savedToken}`;
      }
    }

    const response = await fetch(`${baseUrl}/utils/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Image upload failed. Please ensure you are logged in.');
    }

    const data = await response.json();
    const apiRoot = baseUrl.replace(/\/api\/v1\/?$/, '');
    const fullUrl = data.url.startsWith('http') ? data.url : `${apiRoot}${data.url}`;
    return {
      ...data,
      url: fullUrl,
    };
  },
};
