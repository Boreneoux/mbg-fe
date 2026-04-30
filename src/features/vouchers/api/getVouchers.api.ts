import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Voucher } from '../types';

export interface GetVouchersParams {
  page?: number;
  limit?: number;
  usage_type?: string;
  search?: string;
}

export async function getVouchersApi(params?: GetVouchersParams) {
  const response = await axiosInstance.get<ApiResponse<Voucher[]>>('/vouchers', {
    params,
  });

  return response.data;
}
