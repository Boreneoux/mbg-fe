import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { AuthUser } from '@/features/auth/types';

export async function sessionApi() {
  try {
    const response = await axiosInstance.get<ApiResponse<{ user: AuthUser }>>('/auth/me');
    return response.data.data.user;
  } catch {
    return null;
  }
}
