import axiosInstance from '@/utils/axiosInstance';

export async function deleteStoreApi(slug: string) {
  try {
    await axiosInstance.delete(`/stores/${slug}`);
  } catch (error: unknown) {
    throw (error as { response?: unknown }).response;
  }
}
