import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';

type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
};

export async function registerApi(payload: RegisterPayload) {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>('/auth/register', payload);
    return response.data;
  } catch (error: any) {
    throw error?.response;
  }
}
