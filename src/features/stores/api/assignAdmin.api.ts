import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { StoreAdmin } from '@/features/stores/types';

export async function assignAdminApi(storeSlug: string, userId: string) {
  try {
    const response = await axiosInstance.post<ApiResponse<{ storeAdmin: StoreAdmin }>>(
      `/stores/${storeSlug}/admins`,
      { user_id: userId },
    );
    return response.data.data.storeAdmin;
  } catch (error: unknown) {
    throw (error as { response?: unknown }).response;
  }
}
