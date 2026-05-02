import api from '@/utils/axiosInstance';
import { CreateVoucherFormValues } from '../schemas/voucher.schema';
import { Voucher } from '../types';

export const updateVoucherApi = async (id: string, data: Partial<CreateVoucherFormValues>): Promise<Voucher> => {
  const response = await api.put(`/vouchers/${id}`, data);
  return response.data.data;
};
