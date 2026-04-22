import axiosInstance from '@/utils/axiosInstance';

export async function refreshApi() {
  const response = await axiosInstance.post('/auth/refresh');
  return response.data;
}
