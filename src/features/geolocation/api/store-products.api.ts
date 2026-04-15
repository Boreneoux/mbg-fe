import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Product } from '@/features/products/types';

export async function getStoreProductsApi(storeId: number) {
  const response = await axiosInstance.get<ApiResponse<Product[]>>(
    `/stores/${storeId}/products`,
  );
  return response.data.data;
}
