import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Order, OrderPaginationMeta } from '../types';

export const getOrdersApi = async (
  page: number,
  limit: number,
  search?: string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }

  const response = await axiosInstance.get<{ data: Order[], meta: OrderPaginationMeta }>(
    `/orders?${params.toString()}`
  );
  
  return response.data;
};

export const getOrderApi = async (id: string | number) => {
  const response = await axiosInstance.get<{ data: Order }>(`/orders/${id}`);
  return response.data.data;
};
