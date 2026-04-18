import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Store } from '@/features/stores/types';
import { CreateStoreFormValues } from '@/features/stores/schemas/store.schema';

export async function createStoreApi(payload: CreateStoreFormValues) {
  try {
    const response = await axiosInstance.post<ApiResponse<{ store: Store }>>('/stores', payload);
    return response.data.data.store;
  } catch (error: unknown) {
    throw (error as { response?: unknown }).response;
  }
}
