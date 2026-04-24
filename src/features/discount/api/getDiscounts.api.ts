import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Discount } from '../types';

export interface GetDiscountsParams {
  page?: number;
  limit?: number;
  store_id?: number;
  product_id?: number;
  is_active?: boolean;
}

export async function getDiscountsApi(params?: GetDiscountsParams) {
  const response = await axiosInstance.get<ApiResponse<Discount[]>>('/discounts', {
    params,
  });

  return response.data;
}
