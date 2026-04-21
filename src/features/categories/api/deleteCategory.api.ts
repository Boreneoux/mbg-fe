import axiosInstance from '@/utils/axiosInstance';
import { DeleteCategoryResponse } from '../types';

export const deleteCategoryApi = async (id: number): Promise<DeleteCategoryResponse> => {
  const response = await axiosInstance.delete<DeleteCategoryResponse>(
    `/categories/${id}`
  );
  return response.data;
};
