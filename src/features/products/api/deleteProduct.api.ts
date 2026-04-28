import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';

export async function deleteProductApi(slug: string) {
  const response = await axiosInstance.delete<ApiResponse<null>>(`/products/${slug}`);
  return response.data.message;
}
