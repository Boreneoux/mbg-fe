'use client';

import { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { UserWithStore } from '../types';
import { getUserByIdApi } from '../api/users.api';

export function useGetUserById(userId: number) {
  const [user, setUser] = useState<UserWithStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUserByIdApi(userId);
        if (!cancelled) setUser(data);
      } catch (err) {
        if (cancelled) return;
        const message = isAxiosError(err)
          ? (err.response?.data?.message ?? 'Failed to load user')
          : 'Failed to load user';
        setError(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchUser();
    return () => { cancelled = true; };
  }, [userId]);

  return { user, isLoading, error };
}
