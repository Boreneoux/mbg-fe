import { UserRole } from '@/features/auth/types';

export type UserListItem = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
};

export type UserWithStore = UserListItem & {
  store_admins?: { store: { id: number; name: string } }[];
};

export type UserPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CreateUserPayload = {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  phone?: string;
  role: 'store_admin' | 'user';
  store_id?: number;
};

export type UpdateUserPayload = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_verified?: boolean;
  role?: 'store_admin' | 'user';
};

export type ChangeRolePayload = {
  role: 'store_admin' | 'user';
};

export type StoreOption = {
  id: number;
  name: string;
};
