import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { StoreOption } from '../types';

type StoresResponse = StoreOption[];

export async function getStoresApi() {
  const response = await axiosInstance.get<ApiResponse<StoresResponse>>(
    '/stores'
  );
  return response.data.data;
}
