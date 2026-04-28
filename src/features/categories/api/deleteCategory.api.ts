import axiosInstance from '@/utils/axiosInstance';
import { DeleteCategoryResponse } from '../types';

export const deleteCategoryApi = async (slug: string) => {
  const response = await axiosInstance.delete<DeleteCategoryResponse>(
    `/categories/${slug}`
  );
  return response.data;
};
