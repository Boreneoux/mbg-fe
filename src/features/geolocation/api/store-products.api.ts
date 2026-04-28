import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Product } from '@/features/products/types';

export async function getStoreProductsApi(storeSlug: string) {
  const response = await axiosInstance.get<ApiResponse<Product[]>>(
    `/stores/${storeSlug}/products`,
  );
  return response.data.data;
}
