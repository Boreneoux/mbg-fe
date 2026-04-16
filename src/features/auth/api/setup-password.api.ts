import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';

type SetupPasswordPayload = {
  token: string;
  password: string;
  confirm_password: string;
};

export async function setupPasswordApi(payload: SetupPasswordPayload) {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>('/auth/verify-email', payload);
    return response.data;
  } catch (error: any) {
    throw error?.response;
  }
}
