import api from '@/utils/axiosInstance';
import { Discount } from '../types';
import { PaginationMeta } from '@/types/api';

export interface GetDiscountsParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}

interface GetDiscountsResponse {
  data: Discount[];
  meta: PaginationMeta;
}

export const getDiscountsApi = async (params?: GetDiscountsParams): Promise<GetDiscountsResponse> => {
  const { data } = await api.get('/discounts', { params });
  return data;
};
