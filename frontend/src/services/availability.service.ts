import api from './api';
import type { ApiResponse, AvailabilityQuery, AvailabilityResult } from '@/types';

export const availabilityService = {
  async check(query: AvailabilityQuery): Promise<AvailabilityResult> {
    const response = await api.get<ApiResponse<AvailabilityResult>>(
      '/availability',
      { params: query }
    );
    return response.data.data;
  },

  async blockDates(data: {
    roomId: string;
    startDate: string;
    endDate: string;
    reason?: string;
  }): Promise<void> {
    await api.post('/availability/block', data);
  },
};
