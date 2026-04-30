import { useState, useEffect, useCallback } from 'react';
import { getInventoriesApi } from '../api/getInventories.api';
import { StoreInventory } from '../types';
import axios from 'axios';
import { PaginationMeta } from '@/types/api';
import { useDebounce } from '@/hooks/useDebounce';

const LIMIT = 10;

// store_id is external (driven by the store selector), search/page are internal
export function useInventories(storeId?: string) {
  const [inventories, setInventories] = useState<StoreInventory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: LIMIT, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(search, 400);

  // Reset page on search or store change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, storeId]);

  useEffect(() => {
    let cancelled = false;

    const fetchInventories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { inventories, meta } = await getInventoriesApi({
          store_id: storeId,
          page,
          limit: LIMIT,
          search: debouncedSearch || undefined,
        });
        if (!cancelled) {
          setInventories(inventories);
          if (meta) setMeta(meta);
        }
      } catch (err) {
        if (cancelled) return;
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch inventories');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchInventories();
    return () => { cancelled = true; };
  }, [storeId, page, debouncedSearch, refreshKey]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { inventories, meta, isLoading, error, page, setPage, search, setSearch, refetch };
}
