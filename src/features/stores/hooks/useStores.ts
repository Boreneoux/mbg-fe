'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getStoresApi } from '@/features/stores/api/getStores.api';
import { Store } from '@/features/stores/types';

type ApiErr = { data?: { message?: string } };

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStoresApi();
      setStores(data ?? []);
    } catch (err) {
      const message = (err as ApiErr)?.data?.message ?? 'Failed to load stores';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return { stores, isLoading, error, refetch: fetchStores };
}
