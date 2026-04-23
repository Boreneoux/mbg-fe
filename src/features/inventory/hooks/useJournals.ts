import { useState, useEffect, useCallback } from 'react';
import { getJournalsApi, GetJournalsParams } from '../api/getJournals.api';
import { StockJournal } from '../types';
import axios from 'axios';

export function useJournals(params?: GetJournalsParams) {
  const [journals, setJournals] = useState<StockJournal[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchJournals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getJournalsApi(params);
        if (!cancelled) {
          setJournals(data.journals);
          if (data.meta) {
            setMeta(data.meta);
          }
        }
      } catch (err) {
        if (cancelled) return;
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch journals');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchJournals();
    return () => { cancelled = true; };
  }, [
    params?.store_id, 
    params?.product_id, 
    params?.type, 
    params?.from, 
    params?.to, 
    params?.page, 
    params?.limit, 
    params?.sort,
    refreshKey
  ]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { journals, meta, isLoading, error, refetch };
}
