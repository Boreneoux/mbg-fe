import axiosInstance from '@/utils/axiosInstance';
import { StockJournal, StockJournalType } from '../types';
import { ApiResponse } from '@/types/api';

export interface GetJournalsParams {
  store_id?: number;
  product_id?: number;
  type?: StockJournalType;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
}

export async function getJournalsApi(params?: GetJournalsParams) {
  const { data } = await axiosInstance.get<ApiResponse<{ journals: StockJournal[] }>>('/inventory/journal', {
    params,
  });
  return {
    journals: data.data.journals,
    meta: data.meta,
  };
}
