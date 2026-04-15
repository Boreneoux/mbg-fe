import axiosInstance from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/api';
import type { Order } from '@/features/orders/types';

export async function getOrderApi(orderId: string | number) {
  const response = await axiosInstance.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data.data;
}
