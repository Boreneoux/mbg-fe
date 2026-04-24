import axiosInstance from '@/utils/axiosInstance';
import { StockMutation } from '../types';
import { ApiResponse } from '@/types/api';

export interface CreateMutationPayload {
  source_store_id: number;
  destination_store_id: number;
  product_id: number;
  quantity: number;
}

export async function createMutationApi(payload: CreateMutationPayload) {
  const { data } = await axiosInstance.post<ApiResponse<StockMutation>>('/mutations', payload);
  return data.data;
}
