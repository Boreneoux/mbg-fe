import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import {
  UserListItem,
  UserWithStore,
  CreateUserPayload,
  UpdateUserPayload,
  ChangeRolePayload,
  UserPaginationMeta,
} from '../types';

// Backend returns meta at the top level, not nested inside data
type GetUsersRawResponse = {
  success: boolean;
  message: string;
  data: UserWithStore[];
  meta: UserPaginationMeta;
};

export async function listUsersApi(
  page: number,
  limit: number,
  search?: string,
  role?: 'store_admin' | 'user'
) {
  const response = await axiosInstance.get<GetUsersRawResponse>(
    '/users',
    {
      params: {
        page,
        limit,
        ...(search && { search }),
        ...(role && { role }),
      },
    }
  );
  return { users: response.data.data, meta: response.data.meta };
}

export async function getUserByIdApi(id: string) {
  const response = await axiosInstance.get<ApiResponse<UserWithStore>>(
    `/users/${id}`
  );
  return response.data.data;
}

export async function createUserApi(payload: CreateUserPayload) {
  const response = await axiosInstance.post<ApiResponse<UserWithStore>>(
    '/users',
    payload
  );
  return response.data.data;
}

export async function updateUserApi(
  id: string,
  payload: UpdateUserPayload
) {
  const response = await axiosInstance.patch<ApiResponse<UserWithStore>>(
    `/users/${id}`,
    payload
  );
  return response.data.data;
}

export async function changeRoleApi(
  id: string,
  payload: ChangeRolePayload
) {
  const response = await axiosInstance.patch<ApiResponse<UserWithStore>>(
    `/users/${id}/role`,
    payload
  );
  return response.data.data;
}

export async function deleteUserApi(id: string) {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/users/${id}`
  );
  return response.data;
}
