import { useState, useEffect, useCallback } from 'react';
import { getMutationsApi } from '../api/getMutations.api';
import { StockMutation } from '../types';
import { PaginationMeta } from '@/types/api';
import axios from 'axios';
import { useDebounce } from '@/hooks/useDebounce';

const LIMIT = 10;

export function useMutations() {
  const [mutations, setMutations] = useState<StockMutation[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: LIMIT, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    const fetchMutations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMutationsApi({
          page,
          limit: LIMIT,
          sort,
          search: debouncedSearch || undefined,
        });
        if (!cancelled) {
          setMutations(data.mutations);
          if (data.meta) setMeta(data.meta);
        }
      } catch (err) {
        if (cancelled) return;
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch mutations');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchMutations();
    return () => { cancelled = true; };
  }, [page, debouncedSearch, sort, refreshKey]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { mutations, meta, isLoading, error, page, setPage, search, setSearch, sort, setSort, refetch };
}
