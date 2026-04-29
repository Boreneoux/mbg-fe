import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Product } from '@/features/products/types';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}

export async function getProductsApi(params?: GetProductsParams) {
  const response = await axiosInstance.get<ApiResponse<Product[]>>('/products', { params });
  return response.data;
}
