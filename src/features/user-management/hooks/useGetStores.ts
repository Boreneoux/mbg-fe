'use client';

import { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { StoreOption } from '../types';
import { getStoresApi } from '../api/stores.api';

export function useGetStores() {
  const [stores, setStores] = useState<StoreOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStores = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getStoresApi();
        if (!cancelled) {
          setStores(data);
        }
      } catch (err) {
        if (cancelled) return;
        if (isAxiosError(err)) {
          setError(
            err.response?.data?.message ?? 'Failed to load stores.'
          );
        } else {
          setError('Failed to load stores.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchStores();

    return () => {
      cancelled = true;
    };
  }, []);

  return { stores, isLoading, error };
}
