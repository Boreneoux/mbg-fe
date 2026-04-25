import api from '@/utils/axiosInstance';
import { CreateVoucherFormValues } from '../schemas/voucher.schema';
import { Voucher } from '../types';

export const createVoucherApi = async (data: CreateVoucherFormValues): Promise<Voucher> => {
  const response = await api.post('/vouchers', data);
  return response.data.data;
};
