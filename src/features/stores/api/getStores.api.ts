import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Store } from '@/features/stores/types';

export async function getStoresApi() {
  try {
    const response = await axiosInstance.get<ApiResponse<{ stores: Store[] }>>('/stores');
    return response.data.data.stores ?? [];
  } catch (error: unknown) {
    throw (error as { response?: unknown }).response;
  }
}
