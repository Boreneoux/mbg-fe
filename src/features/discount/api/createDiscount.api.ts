import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { CreateDiscountInput, Discount } from '../types';

export async function createDiscountApi(input: CreateDiscountInput) {
  const response = await axiosInstance.post<ApiResponse<Discount>>(
    '/discounts',
    input
  );

  return response.data.data;
}
