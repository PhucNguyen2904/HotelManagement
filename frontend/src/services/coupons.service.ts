import api from './api';
import type { ApiResponse, CouponValidation } from '@/types';

export interface ValidateCouponQuery {
  code: string;
  hotelId: string;
  amount: number;
  nights: number;
}

export const couponsService = {
  async validate(query: ValidateCouponQuery): Promise<CouponValidation> {
    const response = await api.get<ApiResponse<CouponValidation>>(
      '/coupons/validate',
      { params: query }
    );
    return response.data.data;
  },
};
