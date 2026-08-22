import { apiClient } from './client';
import type { Review } from '@/src/types';

export interface BackendReview {
  id: string;
  target_id: string;
  target_type: string;
  rating: number;
  reviewer_name: string;
  comment: string;
  created_at?: string;
}

export function mapBackendReviewToFrontend(br: BackendReview): Review {
  return {
    id: br.id,
    targetId: br.target_id,
    targetType: (br.target_type as any) || 'product',
    userId: 'user-id',
    userName: br.reviewer_name || 'Guest Reviewer',
    rating: br.rating,
    title: 'Customer Feedback',
    comment: br.comment,
    createdAt: br.created_at || new Date().toISOString(),
  };
}

export const reviewsApi = {
  async getTargetReviews(targetId: string, targetType: 'product' | 'stay'): Promise<Review[]> {
    const res = await apiClient<{ data: BackendReview[]; count: number }>(`/reviews/target/${targetId}`, {
      params: { target_type: targetType },
    });
    return (res.data || []).map(mapBackendReviewToFrontend);
  },

  async createReview(data: {
    target_id: string;
    target_type: 'product' | 'stay';
    rating: number;
    reviewer_name: string;
    comment: string;
  }): Promise<Review> {
    const br = await apiClient<BackendReview>('/reviews/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return mapBackendReviewToFrontend(br);
  },
};
