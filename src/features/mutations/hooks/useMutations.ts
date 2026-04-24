import { useState, useEffect, useCallback } from 'react';
import { getMutationsApi, GetMutationsParams } from '../api/getMutations.api';
import { StockMutation } from '../types';
import { PaginationMeta } from '@/types/api';
import axios from 'axios';

export function useMutations(params?: GetMutationsParams) {
  const [mutations, setMutations] = useState<StockMutation[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchMutations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMutationsApi(params);
        if (!cancelled) {
          setMutations(data.mutations);
          setMeta(data.meta);
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
  }, [params?.page, params?.limit, params?.sort, refreshKey]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { mutations, meta, isLoading, error, refetch };
}
