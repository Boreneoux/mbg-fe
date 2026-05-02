import api from '@/utils/axiosInstance';
import { CreateDiscountFormValues } from '../schemas/discount.schema';
import { Discount } from '../types';

export const createDiscountApi = async (data: CreateDiscountFormValues): Promise<Discount> => {
  const response = await api.post('/discounts', data);
  return response.data.data;
};
