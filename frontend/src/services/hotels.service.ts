import api from './api';
import type { ApiResponse, Hotel, PaginatedResponse } from '@/types';

export interface HotelsQuery {
  city?: string;
  page?: number;
  limit?: number;
}

export const hotelsService = {
  async getAll(query?: HotelsQuery): Promise<PaginatedResponse<Hotel>> {
    const response = await api.get<PaginatedResponse<Hotel>>('/hotels', {
      params: query,
    });
    return response.data;
  },

  async getById(id: string): Promise<Hotel> {
    const response = await api.get<ApiResponse<Hotel>>(`/hotels/${id}`);
    return response.data.data;
  },

  async getBySlug(slug: string): Promise<Hotel> {
    const response = await api.get<ApiResponse<Hotel>>(`/hotels/slug/${slug}`);
    return response.data.data;
  },
};
