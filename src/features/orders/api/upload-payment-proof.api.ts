import axiosInstance from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/api';

export async function uploadPaymentProofApi(orderId: string, proof: File) {
  const formData = new FormData();
  formData.append('proof', proof);

  const response = await axiosInstance.post<ApiResponse<null>>(
    `/orders/${orderId}/payment-proof`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}
