import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Order, OrderPaginationMeta } from '../types';

export interface CreateOrderData {
  address_id: number;
  payment_method: 'payment_gateway';
  voucher_code?: string;
  shipping_method?: string;
  shipping_cost?: number;
  cart_item_ids?: number[];
}

export const getOrdersApi = async (
  page: number,
  limit: number,
  search?: string,
  status?: string,
  warehouse_id?: number | string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }

  if (status && status !== 'all') {
    params.append('status', status);
  }

  if (warehouse_id && warehouse_id !== 'all') {
    params.append('warehouse_id', warehouse_id.toString());
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

export const getAdminOrdersApi = async (
  page: number,
  limit: number,
  search?: string,
  status?: string,
  warehouse_id?: number | string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('order_number', search); // Admin API uses order_number for search
  }

  if (status && status !== 'all') {
    params.append('status', status);
  }

  if (warehouse_id && warehouse_id !== 'all') {
    params.append('warehouse_id', warehouse_id.toString());
  }

  const response = await axiosInstance.get<{ data: Order[], meta: OrderPaginationMeta }>(
    `/admin/orders?${params.toString()}`
  );
  
  return response.data;
};

export const getAdminOrderApi = async (id: string | number) => {
  const response = await axiosInstance.get<{ data: Order }>(`/admin/orders/${id}`);
  return response.data.data;
};

export const createOrderApi = async (data: CreateOrderData) => {
  const response = await axiosInstance.post<{ data: { order: Order }, message: string, success: boolean }>('/orders', data);
  return response.data;
};

export const getPaymentUrlApi = async (id: string | number) => {
  const response = await axiosInstance.get<{ data: { payment_url: string, order: Order }, message: string, success: boolean }>(`/orders/${id}/payment-url`);
  return response.data;
};
