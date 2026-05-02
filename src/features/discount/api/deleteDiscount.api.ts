import api from '@/utils/axiosInstance';

export const deleteDiscountApi = async (id: string): Promise<void> => {
  await api.delete(`/discounts/${id}`);
};
