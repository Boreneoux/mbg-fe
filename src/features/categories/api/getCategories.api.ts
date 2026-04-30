import axiosInstance from '@/utils/axiosInstance';
import { CategoriesResponse } from '../types';

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getCategoriesApi = async (params?: GetCategoriesParams) => {
  const response = await axiosInstance.get<CategoriesResponse>(
    '/categories',
    { params }
  );
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
};
