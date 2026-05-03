import axiosInstance from '@/utils/axiosInstance';
import { StoreInventory } from '../types';

import { PaginationMeta } from '@/types/api';

export interface GetInventoriesParams {
  store_id?: string;
  product_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getInventoriesApi(params?: GetInventoriesParams) {
  const { data } = await axiosInstance.get<{ success: boolean; data: { inventories: StoreInventory[]; meta: PaginationMeta } }>('/inventory', {
    params,
  });
  return {
    inventories: data.data.inventories,
    meta: data.data.meta,
  };
}
