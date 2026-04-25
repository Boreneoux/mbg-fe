import api from '@/utils/axiosInstance';
import { Discount } from '../types';
import { PaginationMeta } from '@/types/api';

interface GetDiscountsResponse {
  data: Discount[];
  meta: PaginationMeta;
}

export const getDiscountsApi = async (params?: Record<string, any>): Promise<GetDiscountsResponse> => {
  const { data } = await api.get('/discounts', { params });
  return data;
};
