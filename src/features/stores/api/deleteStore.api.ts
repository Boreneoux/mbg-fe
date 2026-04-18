import axiosInstance from '@/utils/axiosInstance';

export async function deleteStoreApi(id: number) {
  try {
    await axiosInstance.delete(`/stores/${id}`);
  } catch (error: unknown) {
    throw (error as { response?: unknown }).response;
  }
}
