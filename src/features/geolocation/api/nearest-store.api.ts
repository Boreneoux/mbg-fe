import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { NearestStoreResponse } from '@/features/geolocation/types';

export async function getNearestStoreApi(lat: number, lng: number) {
  const response = await axiosInstance.get<ApiResponse<NearestStoreResponse>>(
    '/stores/nearest',
    { params: { lat, lng } },
  );
  return response.data.data;
}
