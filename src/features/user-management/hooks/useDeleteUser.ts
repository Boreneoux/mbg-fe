'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { deleteUserApi } from '../api/users.api';

export function useDeleteUser(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (userId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteUserApi(userId);
      toast.success('User deleted successfully');
      onSuccess?.();
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? 'Failed to delete user'
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
