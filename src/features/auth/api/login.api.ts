import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { AuthUser } from '@/features/auth/types';

type LoginPayload = {
  email: string;
  password: string;
};

export async function loginApi(payload: LoginPayload) {
  try {
    const response = await axiosInstance.post<ApiResponse<{ user: AuthUser }>>('/auth/login', payload);
    return response.data.data.user;
  } catch (error: any) {
    throw error?.response;
  }
}
