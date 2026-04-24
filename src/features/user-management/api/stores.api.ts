import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { StoreOption } from '../types';

type StoresResponse = { stores: StoreOption[]; meta: unknown };

export async function getStoresApi() {
  const response = await axiosInstance.get<ApiResponse<StoresResponse>>(
    '/stores',
    { params: { limit: 100 } }
  );
  return response.data.data.stores;
}

export async function assignStoreAdminApi(storeId: number, userId: number) {
  const response = await axiosInstance.post<ApiResponse<unknown>>(
    `/stores/${storeId}/admins`,
    { user_id: userId }
  );
  return response.data;
}

export async function unassignStoreAdminApi(storeId: number, userId: number) {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/stores/${storeId}/admins/${userId}`
  );
  return response.data;
}
