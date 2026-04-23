import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Product } from '@/features/products/types';

export async function getProductByIdApi(id: number) {
  const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data.data;
}
