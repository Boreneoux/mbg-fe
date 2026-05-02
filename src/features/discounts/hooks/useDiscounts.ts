'use client';

import { useEffect, useState } from 'react';
import { Discount } from '../types';
import { getDiscountsApi } from '../api/getDiscounts.api';
import { isAxiosError } from 'axios';
import { PaginationMeta } from '@/types/api';
import { useDebounce } from '@/hooks/useDebounce';

const LIMIT = 10;

export function useDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: LIMIT, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    const fetchDiscounts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getDiscountsApi({
          page,
          limit: LIMIT,
          search: debouncedSearch || undefined,
        });
        if (!cancelled) {
          setDiscounts(result.data);
          if (result.meta) setMeta(result.meta);
        }
      } catch (err) {
        if (!cancelled) {
          const message = isAxiosError(err)
            ? (err.response?.data?.message ?? 'Failed to fetch discounts')
            : 'An unexpected error occurred';
          setError(message);
          setDiscounts([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDiscounts();
    return () => { cancelled = true; };
  }, [page, debouncedSearch, refreshKey]);

  function refetch() {
    setRefreshKey((k) => k + 1);
  }

  return { discounts, meta, isLoading, error, page, setPage, search, setSearch, refetch };
}
