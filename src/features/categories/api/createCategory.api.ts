import axiosInstance from '@/utils/axiosInstance';
import { CreateCategoryPayload, CreateCategoryResponse } from '../types';

export const createCategoryApi = async (
  payload: CreateCategoryPayload
): Promise<CreateCategoryResponse> => {
  const formData = new FormData();
  formData.append('name', payload.name);
  if (payload.description) {
    formData.append('description', payload.description);
  }
  if (payload.photo) {
    formData.append('photo', payload.photo);
  }

  const response = await axiosInstance.post<CreateCategoryResponse>(
    '/categories',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};
