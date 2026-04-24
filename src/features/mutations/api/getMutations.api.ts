import axiosInstance from '@/utils/axiosInstance';
import { StockMutation } from '../types';
import { ApiResponse, PaginationMeta } from '@/types/api';

export interface GetMutationsParams {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
}

export async function getMutationsApi(params?: GetMutationsParams) {
  const { data } = await axiosInstance.get<ApiResponse<{ mutations: StockMutation[]; meta: PaginationMeta }>>('/mutations', {
    params,
  });
  return {
    mutations: data.data.mutations,
    meta: data.data.meta,
  };
}
