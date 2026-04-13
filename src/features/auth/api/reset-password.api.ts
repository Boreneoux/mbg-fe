import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';

type ResetPasswordPayload = {
  token: string;
  new_password: string;
};

export async function resetPasswordApi(payload: ResetPasswordPayload) {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>('/auth/reset-password', payload);
    return response.data;
  } catch (error: any) {
    throw error?.response;
  }
}
