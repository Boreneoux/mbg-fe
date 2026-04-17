import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { UserProfile } from '../types';
import { PersonalInfoValues, ChangePasswordValues } from '../schemas/profile.schema';

export async function getProfileApi(): Promise<UserProfile> {
  const res = await axiosInstance.get<ApiResponse<UserProfile>>('/users/me');
  return res.data.data;
}

export async function updateProfileApi(
  payload: Partial<PersonalInfoValues> & Partial<ChangePasswordValues> & { photo?: File },
): Promise<UserProfile> {
  const form = new FormData();

  if (payload.first_name !== undefined) form.append('first_name', payload.first_name);
  if (payload.last_name !== undefined) form.append('last_name', payload.last_name ?? '');
  if (payload.phone !== undefined) form.append('phone', payload.phone ?? '');
  if (payload.email !== undefined) form.append('email', payload.email);
  if (payload.current_password !== undefined)
    form.append('current_password', payload.current_password);
  if (payload.new_password !== undefined) form.append('new_password', payload.new_password);
  if (payload.photo) form.append('photo', payload.photo);

  const res = await axiosInstance.put<ApiResponse<UserProfile>>('/users/me', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export async function resendVerificationApi(email: string): Promise<void> {
  await axiosInstance.post('/auth/resend-verification', { email });
}
