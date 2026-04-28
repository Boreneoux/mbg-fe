import api from '@/utils/axiosInstance';
import { Voucher } from '../types';

export const setReferrerRewardVoucherApi = async (id: number): Promise<Voucher> => {
  const response = await api.patch(`/vouchers/${id}/set-referrer-reward`);
  return response.data.data;
};
