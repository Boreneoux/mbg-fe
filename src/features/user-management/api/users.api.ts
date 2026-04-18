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

type ListUsersResponse = {
  data: UserWithStore[];
  meta: UserPaginationMeta;
};

export async function listUsersApi(
  page: number,
  limit: number,
  search?: string,
  role?: 'store_admin' | 'user'
) {
  const response = await axiosInstance.get<ApiResponse<ListUsersResponse>>(
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
  return response.data.data;
}

export async function getUserByIdApi(id: number) {
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
  id: number,
  payload: UpdateUserPayload
) {
  const response = await axiosInstance.patch<ApiResponse<UserWithStore>>(
    `/users/${id}`,
    payload
  );
  return response.data.data;
}

export async function changeRoleApi(
  id: number,
  payload: ChangeRolePayload
) {
  const response = await axiosInstance.patch<ApiResponse<UserWithStore>>(
    `/users/${id}/role`,
    payload
  );
  return response.data.data;
}

export async function deleteUserApi(id: number) {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/users/${id}`
  );
  return response.data;
}
