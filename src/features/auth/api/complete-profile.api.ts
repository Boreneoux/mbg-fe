import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';

type CompleteProfilePayload = {
  phone: string;
  referral_code?: string;
};

export async function completeProfileApi(payload: CompleteProfilePayload) {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>('/auth/complete-profile', payload);
    return response.data;
  } catch (error: any) {
    throw error?.response;
  }
}
