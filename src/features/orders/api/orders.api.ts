import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Order, OrderPaginationMeta } from '../types';

export interface CreateOrderData {
  address_id: string;
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

export const getOrderApi = async (orderNumber: string) => {
  const response = await axiosInstance.get<{ data: Order }>(`/orders/${orderNumber}`);
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

export const getAdminOrderApi = async (orderNumber: string) => {
  const response = await axiosInstance.get<{ data: Order }>(`/admin/orders/${orderNumber}`);
  return response.data.data;
};

export const createOrderApi = async (data: CreateOrderData) => {
  const response = await axiosInstance.post<{ data: { order: Order }, message: string, success: boolean }>('/orders', data);
  return response.data;
};

export const getPaymentUrlApi = async (orderNumber: string) => {
  const response = await axiosInstance.get<{ data: { payment_url: string, snap_token: string, order: Order }, message: string, success: boolean }>(`/orders/${orderNumber}/payment-url`);
  return response.data;
};

export const adminConfirmPaymentApi = async (orderNumber: string) => {
  const response = await axiosInstance.post(`/admin/orders/${orderNumber}/confirm-payment-proof`);
  return response.data;
};

export const adminRejectPaymentApi = async (orderNumber: string) => {
  const response = await axiosInstance.post(`/admin/orders/${orderNumber}/reject-payment-proof`);
  return response.data;
};

export const adminShipOrderApi = async (orderNumber: string) => {
  const response = await axiosInstance.post(`/admin/orders/${orderNumber}/ship`);
  return response.data;
};

export const adminCancelOrderApi = async (orderNumber: string) => {
  const response = await axiosInstance.post(`/admin/orders/${orderNumber}/cancel`);
  return response.data;
};

export const cancelOrderApi = async (orderNumber: string) => {
  const response = await axiosInstance.post(`/orders/${orderNumber}/cancel`);
  return response.data;
};

export const confirmReceiptApi = async (orderNumber: string) => {
  const response = await axiosInstance.post(`/orders/${orderNumber}/confirm-receipt`);
  return response.data;
};

export const getPaymentStatusApi = async (orderNumber: string) => {
  const response = await axiosInstance.get(`/orders/${orderNumber}/payment-status`);
  return response.data;
};
