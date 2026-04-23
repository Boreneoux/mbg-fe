import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { ProductCategory } from '@/features/products/types';

export async function getCategoriesApi() {
  const response = await axiosInstance.get<ApiResponse<ProductCategory[]>>('/categories');
  return response.data.data ?? [];
}
