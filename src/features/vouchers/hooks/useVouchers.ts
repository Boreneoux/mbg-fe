'use client';

import { useEffect, useState } from 'react';
import { getVouchersApi } from '../api/getVouchers.api';
import { Voucher } from '../types';
import { PaginationMeta } from '@/types/api';
import { useDebounce } from '@/hooks/useDebounce';

const LIMIT = 10;

export function useVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
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

    const fetchVouchers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getVouchersApi({
          page,
          limit: LIMIT,
          search: debouncedSearch || undefined,
        });
        if (!cancelled) {
          setVouchers(response.data);
          if (response.meta) setMeta(response.meta);
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load vouchers.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchVouchers();
    return () => { cancelled = true; };
  }, [page, debouncedSearch, refreshKey]);

  function refetch() {
    setRefreshKey((k) => k + 1);
  }

  return { vouchers, meta, isLoading, error, page, setPage, search, setSearch, refetch };
}
