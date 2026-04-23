import axiosInstance from '@/utils/axiosInstance';
import { StoreInventory, StockJournal } from '../types';
import { ApiResponse } from '@/types/api';

export interface AdjustStockPayload {
  store_id?: number;
  product_id: number;
  quantity: number;
  type: 'addition' | 'reduction';
  description?: string;
}

export async function adjustStockApi(payload: AdjustStockPayload) {
  const { data } = await axiosInstance.post<ApiResponse<{ inventory: StoreInventory; journal: StockJournal }>>('/inventory/adjust', payload);
  return data.data;
}
