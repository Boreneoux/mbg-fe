import axiosInstance from '@/utils/axiosInstance';
import { CategoryDetailResponse } from '../types';

export const getCategoryDetailApi = async (slug: string) => {
  const response = await axiosInstance.get<CategoryDetailResponse>(
    `/categories/${slug}`
  );
  return response.data.data;
};
