import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Product } from '@/features/products/types';

export async function getProductsApi() {
  const response = await axiosInstance.get<ApiResponse<{ products: Product[] }>>('/products');
  return response.data.data.products ?? [];
}
