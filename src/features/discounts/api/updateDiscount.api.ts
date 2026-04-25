import api from '@/utils/axiosInstance';
import { CreateDiscountFormValues } from '../schemas/discount.schema';
import { Discount } from '../types';

export const updateDiscountApi = async (id: number, data: Partial<CreateDiscountFormValues> & { is_active?: boolean }): Promise<Discount> => {
  const response = await api.put(`/discounts/${id}`, data);
  return response.data.data;
};
