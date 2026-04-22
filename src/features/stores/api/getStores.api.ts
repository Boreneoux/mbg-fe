import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Store, StorePaginationMeta } from '@/features/stores/types';

type GetStoresResponse = {
  stores: Store[];
  meta: StorePaginationMeta;
};

export async function getStoresApi(page: number = 1, limit: number = 10, search?: string) {
  try {
    const response = await axiosInstance.get<ApiResponse<GetStoresResponse>>('/stores', {
      params: { page, limit, ...(search && { search }) },
    });
    return response.data.data;
  } catch (error: unknown) {
    throw (error as { response?: unknown }).response;
  }
}
