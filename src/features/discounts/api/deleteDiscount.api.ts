import api from '@/utils/axiosInstance';

export const deleteDiscountApi = async (id: number): Promise<void> => {
  await api.delete(`/discounts/${id}`);
};
