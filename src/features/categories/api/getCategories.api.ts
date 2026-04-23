import axiosInstance from '@/utils/axiosInstance';
import { CategoriesResponse } from '../types';

export const getCategoriesApi = async () => {
  const response = await axiosInstance.get<CategoriesResponse>(
    '/categories'
  );
  return response.data.data;
};
