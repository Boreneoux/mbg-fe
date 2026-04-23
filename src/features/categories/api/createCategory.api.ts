import axiosInstance from '@/utils/axiosInstance';
import { CreateCategoryPayload, CreateCategoryResponse } from '../types';

export const createCategoryApi = async (
  payload: CreateCategoryPayload
) => {
  const formData = new FormData();
  formData.append('name', payload.name);
  if (payload.photo) {
    formData.append('image', payload.photo);
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
  return response.data.data;
};
