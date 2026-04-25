import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';

export async function deleteProductApi(id: number) {
  const response = await axiosInstance.delete<ApiResponse<null>>(`/products/${id}`);
  return response.data.message;
}
