import api from '@/utils/axiosInstance';
import { Voucher } from '../types';

export interface ApplyVoucherData {
  code: string;
  cart_total: number;
  store_id: string;
  product_ids?: string[];
}

export interface ApplyVoucherResponse {
  voucher: Voucher;
  calculatedDiscount: number;
}

export const applyVoucherApi = async (data: ApplyVoucherData): Promise<ApplyVoucherResponse> => {
  const response = await api.post('/vouchers/apply', data);
  return response.data.data;
};
