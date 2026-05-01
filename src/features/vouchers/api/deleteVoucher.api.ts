import api from '@/utils/axiosInstance';

export const deleteVoucherApi = async (id: string): Promise<void> => {
  await api.delete(`/vouchers/${id}`);
};
