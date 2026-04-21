import axiosInstance from '@/utils/axiosInstance';
import { CategoriesResponse } from '../types';

export const getCategoriesApi = async (): Promise<CategoriesResponse> => {
  const response = await axiosInstance.get<CategoriesResponse>(
    '/categories'
  );
  return response.data;
};
