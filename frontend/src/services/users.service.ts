import api from './api';
import type { ApiResponse, PaginatedResponse, User } from '@/types';

export interface UsersQuery {
  page?: number;
  limit?: number;
}

export const usersService = {
  async getAll(query?: UsersQuery): Promise<PaginatedResponse<User & { createdAt?: string; isActive?: boolean }>> {
    const response = await api.get<ApiResponse<PaginatedResponse<User & { createdAt?: string; isActive?: boolean }>>>(
      '/users',
      { params: query }
    );
    return response.data.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  async create(data: Partial<User> & { password?: string }): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<User> & { password?: string }): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  async remove(id: string): Promise<User> {
    const response = await api.delete<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },
};