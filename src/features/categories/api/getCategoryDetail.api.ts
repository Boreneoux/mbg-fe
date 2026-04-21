import axiosInstance from '@/utils/axiosInstance';
import { CategoryDetailResponse } from '../types';

export const getCategoryDetailApi = async (id: number): Promise<CategoryDetailResponse> => {
  const response = await axiosInstance.get<CategoryDetailResponse>(
    `/categories/${id}`
  );
  return response.data;
};
