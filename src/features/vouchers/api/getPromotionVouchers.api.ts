import api from '@/utils/axiosInstance';
import { Voucher } from '../types';

export const getPromotionVouchersApi = async (): Promise<Voucher[]> => {
  const response = await api.get('/vouchers/promotions');
  return response.data.data;
};
