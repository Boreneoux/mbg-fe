import axiosInstance from '@/utils/axiosInstance';
import { UpdateCategoryPayload, UpdateCategoryResponse } from '../types';

export const updateCategoryApi = async (
  slug: string,
  payload: UpdateCategoryPayload
) => {
  const formData = new FormData();
  if (payload.name !== undefined) {
    formData.append('name', payload.name);
  }
  if (payload.photo) {
    formData.append('image', payload.photo);
  }

  const response = await axiosInstance.put<UpdateCategoryResponse>(
    `/categories/${slug}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
};
