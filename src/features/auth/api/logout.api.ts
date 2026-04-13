import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';

export async function logoutApi() {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  } catch (error: any) {
    throw error?.response;
  }
}
