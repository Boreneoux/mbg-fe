import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Product } from '@/features/products/types';

export async function getProductBySlugApi(slug: string) {
  const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${slug}`);
  return response.data.data;
}
