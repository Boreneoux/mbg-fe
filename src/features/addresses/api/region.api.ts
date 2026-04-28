import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { Province, City, District } from '../types';

export async function getProvincesApi(): Promise<Province[]> {
  const res = await axiosInstance.get<ApiResponse<Province[]>>('/regions/provinces');
  return res.data.data;
}

export async function getCitiesApi(provinceId: string): Promise<City[]> {
  const res = await axiosInstance.get<ApiResponse<City[]>>('/regions/cities', {
    params: { province_id: provinceId },
  });
  return res.data.data;
}

export async function getDistrictsApi(cityId: string): Promise<District[]> {
  const res = await axiosInstance.get<ApiResponse<District[]>>('/regions/districts', {
    params: { city_id: cityId },
  });
  return res.data.data;
}
