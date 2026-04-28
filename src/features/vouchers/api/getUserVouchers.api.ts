import api from '@/utils/axiosInstance';
import { UserVoucher } from '../types';

export const getUserVouchersApi = async (): Promise<UserVoucher[]> => {
  const response = await api.get('/vouchers/mine');
  return response.data.data;
};
