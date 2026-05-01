import api from '@/utils/axiosInstance';
import { Voucher } from '../types';

export const setReferralVoucherApi = async (id: string): Promise<Voucher> => {
  const response = await api.patch(`/vouchers/${id}/set-referral`);
  return response.data.data;
};
