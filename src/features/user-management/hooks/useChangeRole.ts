'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { changeRoleApi } from '../api/users.api';
import { UserWithStore } from '../types';

export function useChangeRole(onSuccess?: (user: UserWithStore) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (
    userId: string,
    role: 'store_admin' | 'user'
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await changeRoleApi(userId, { role });
      toast.success(`User role changed to ${role === 'store_admin' ? 'Store Admin' : 'User'}`);
      onSuccess?.(user);
      return user;
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? 'Failed to change role'
        : 'An unexpected error occurred';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error };
}
