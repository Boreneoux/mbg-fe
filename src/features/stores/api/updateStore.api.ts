import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Store } from '@/features/stores/types';
import { UpdateStoreFormValues } from '@/features/stores/schemas/store.schema';

export async function updateStoreApi(id: number, payload: UpdateStoreFormValues) {
  try {
    const response = await axiosInstance.put<ApiResponse<{ store: Store }>>(`/stores/${id}`, payload);
    return response.data.data.store;
  } catch (error: unknown) {
    throw (error as { response?: unknown }).response;
  }
}
