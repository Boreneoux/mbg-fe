'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getStoreBySlugApi } from '@/features/stores/api/getStoreById.api';
import { Store } from '@/features/stores/types';

type ApiErr = { data?: { message?: string } };

export function useStore(slug: string) {
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    getStoreBySlugApi(slug)
      .then(setStore)
      .catch((err: ApiErr) => {
        const message = err?.data?.message ?? 'Failed to load store';
        setError(message);
        toast.error(message);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  return { store, isLoading, error };
}
