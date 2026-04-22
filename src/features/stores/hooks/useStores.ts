'use client';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { getStoresApi } from '@/features/stores/api/getStores.api';
import { Store, StorePaginationMeta } from '@/features/stores/types';
import { useDebounce } from '@/hooks/useDebounce';

const LIMIT = 10;

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [pagination, setPagination] = useState<StorePaginationMeta>({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 0,
  });

  const debouncedSearch = useDebounce(search, 400);

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    async function fetchStores() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStoresApi(page, LIMIT, debouncedSearch || undefined);
        if (!cancelled) {
          setStores(data.stores);
          setPagination(data.meta);
        }
      } catch (err) {
        if (cancelled) return;
        const message = isAxiosError(err)
          ? (err.response?.data?.message ?? 'Failed to load stores')
          : 'Failed to load stores';
        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchStores();
    return () => { cancelled = true; };
  }, [page, debouncedSearch, refreshKey]);

  function refetch() {
    setRefreshKey((k) => k + 1);
  }

  return { stores, isLoading, error, pagination, page, setPage, search, setSearch, refetch };
}
