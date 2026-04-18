import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Store } from '@/features/stores/types';

export async function getStoreByIdApi(id: number) {
  try {
    const response = await axiosInstance.get<ApiResponse<{ store: Store }>>(`/stores/${id}`);
    return response.data.data.store;
  } catch (error: unknown) {
    throw (error as { response?: unknown }).response;
  }
}
