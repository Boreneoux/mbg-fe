import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { UserAddress } from '../types';

export type CreateAddressPayload = {
  label?: string;
  recipient_name: string;
  phone: string;
  address: string;
  province_id: string;
  city_id: string;
  district_id: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
  is_primary?: boolean;
};

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export async function getAddressesApi(): Promise<UserAddress[]> {
  const res = await axiosInstance.get<ApiResponse<UserAddress[]>>('/users/me/addresses');
  return res.data.data;
}

export async function createAddressApi(data: CreateAddressPayload): Promise<UserAddress> {
  const res = await axiosInstance.post<ApiResponse<UserAddress>>('/users/me/addresses', data);
  return res.data.data;
}

export async function updateAddressApi(id: string, data: UpdateAddressPayload): Promise<UserAddress> {
  const res = await axiosInstance.put<ApiResponse<UserAddress>>(`/users/me/addresses/${id}`, data);
  return res.data.data;
}

export async function deleteAddressApi(id: string): Promise<void> {
  await axiosInstance.delete(`/users/me/addresses/${id}`);
}

export async function setPrimaryAddressApi(id: string): Promise<UserAddress> {
  const res = await axiosInstance.patch<ApiResponse<UserAddress>>(`/users/me/addresses/${id}/primary`);
  return res.data.data;
}
