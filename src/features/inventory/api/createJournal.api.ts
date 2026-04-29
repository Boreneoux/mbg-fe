import axiosInstance from '@/utils/axiosInstance';
import { StoreInventory, StockJournal, StockJournalType } from '../types';
import { ApiResponse } from '@/types/api';

export interface CreateJournalPayload {
  store_id?: string;
  product_id: string;
  quantity: number;
  type: StockJournalType;
  description?: string;
}

export async function createJournalApi(payload: CreateJournalPayload) {
  const { data } = await axiosInstance.post<ApiResponse<{ inventory: StoreInventory; journal: StockJournal }>>('/inventory/journal', payload);
  return data.data;
}