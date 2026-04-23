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
