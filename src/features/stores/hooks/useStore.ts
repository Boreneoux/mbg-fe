'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getStoreByIdApi } from '@/features/stores/api/getStoreById.api';
import { Store } from '@/features/stores/types';

type ApiErr = { data?: { message?: string } };

export function useStore(id: number) {
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    getStoreByIdApi(id)
      .then(setStore)
      .catch((err: ApiErr) => {
        const message = err?.data?.message ?? 'Failed to load store';
        setError(message);
        toast.error(message);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  return { store, isLoading, error };
}
