'use client';

import { useEffect, useState } from 'react';
import { Category } from '../types';
import { getCategoriesApi } from '../api/getCategories.api';
import { isAxiosError } from 'axios';
import { PaginationMeta } from '@/types/api';
import { useDebounce } from '@/hooks/useDebounce';

const LIMIT = 10;

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
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

    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, meta } = await getCategoriesApi({
          page,
          limit: LIMIT,
          search: debouncedSearch || undefined,
        });
        if (!cancelled) {
          setCategories(data);
          if (meta) setMeta(meta);
        }
      } catch (err) {
        if (!cancelled) {
          const message = isAxiosError(err)
            ? (err.response?.data?.message ?? 'Failed to fetch categories')
            : 'An unexpected error occurred';
          setError(message);
          setCategories([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCategories();
    return () => { cancelled = true; };
  }, [page, debouncedSearch, refreshKey]);

  function refetch() {
    setRefreshKey((k) => k + 1);
  }

  return { categories, meta, isLoading, error, page, setPage, search, setSearch, refetch };
}
