import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';

export async function forgotPasswordApi(email: string) {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>('/auth/forgot-password', { email });
    return response.data;
  } catch (error: any) {
    throw error?.response;
  }
}
