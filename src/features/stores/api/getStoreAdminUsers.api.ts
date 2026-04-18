import axiosInstance from '@/utils/axiosInstance';
import { EligibleStoreAdminUser } from '@/features/stores/types';

type GetStoreAdminUsersParams = {
  search?: string;
  page?: number;
  limit?: number;
};

type GetStoreAdminUsersResponse = {
  success: boolean;
  message: string;
  data: EligibleStoreAdminUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getStoreAdminUsersApi(params: GetStoreAdminUsersParams = {}) {
  try {
    const response = await axiosInstance.get<GetStoreAdminUsersResponse>('/users', {
      params: { role: 'store_admin', limit: 50, ...params },
    });
    return { users: response.data.data, meta: response.data.meta };
  } catch (error: unknown) {
    throw (error as { response?: unknown }).response;
  }
}
