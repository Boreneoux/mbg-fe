'use client';

import { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { UserWithStore, UserPaginationMeta } from '../types';
import { listUsersApi } from '../api/users.api';

export function useGetUsers(
  page: number,
  limit: number,
  search?: string,
  roleFilter?: 'store_admin' | 'user'
) {
  const [users, setUsers] = useState<UserWithStore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UserPaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await listUsersApi(page, limit, search, roleFilter);
        if (!cancelled) {
          // Filter out super_admin users on the frontend
          const filteredUsers = data.data.filter(
            (user) => user.role !== 'super_admin'
          );
          setUsers(filteredUsers);
          setPagination(data.meta);
        }
      } catch (err) {
        if (cancelled) return;
        if (isAxiosError(err)) {
          setError(
            err.response?.data?.message ?? 'Failed to load users.'
          );
        } else {
          setError('Failed to load users.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [page, limit, search, roleFilter]);

  return { users, isLoading, error, pagination };
}
