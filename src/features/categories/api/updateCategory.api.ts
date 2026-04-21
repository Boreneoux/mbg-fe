import axiosInstance from '@/utils/axiosInstance';
import { UpdateCategoryPayload, UpdateCategoryResponse } from '../types';

export const updateCategoryApi = async (
  id: number,
  payload: UpdateCategoryPayload
): Promise<UpdateCategoryResponse> => {
  const formData = new FormData();
  if (payload.name !== undefined) {
    formData.append('name', payload.name);
  }
  if (payload.description !== undefined) {
    formData.append('description', payload.description);
  }
  if (payload.photo) {
    formData.append('photo', payload.photo);
  }

  const response = await axiosInstance.patch<UpdateCategoryResponse>(
    `/categories/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};
