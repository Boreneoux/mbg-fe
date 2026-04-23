import axiosInstance from '@/utils/axiosInstance';
import { StoreInventory } from '../types';

export interface GetInventoriesParams {
  store_id?: number;
  product_id?: number;
}

export async function getInventoriesApi(params?: GetInventoriesParams) {
  const { data } = await axiosInstance.get<{ success: boolean; data: { inventories: StoreInventory[] } }>('/inventory', {
    params,
  });
  return data.data.inventories;
}
