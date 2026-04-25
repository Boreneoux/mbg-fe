import api from '@/utils/axiosInstance';

export const deleteVoucherApi = async (id: number): Promise<void> => {
  await api.delete(`/vouchers/${id}`);
};
