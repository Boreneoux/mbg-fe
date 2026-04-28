import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Store } from '@/features/stores/types';

export async function getStoreBySlugApi(slug: string) {
  try {
    const response = await axiosInstance.get<ApiResponse<{ store: Store }>>(`/stores/${slug}`);
    return response.data.data.store;
  } catch (error: unknown) {
    throw (error as { response?: unknown }).response;
  }
}
