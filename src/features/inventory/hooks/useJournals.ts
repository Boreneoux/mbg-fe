import { useState, useEffect, useCallback } from 'react';
import { getJournalsApi, GetJournalsParams } from '../api/getJournals.api';
import { StockJournal } from '../types';
import axios from 'axios';

export function useJournals(params?: GetJournalsParams) {
  const [journals, setJournals] = useState<StockJournal[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJournals = useCallback(async (currentParams?: GetJournalsParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getJournalsApi(currentParams || params);
      setJournals(data.journals);
      if (data.meta) {
        setMeta(data.meta);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch journals');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    params?.store_id, 
    params?.product_id, 
    params?.type, 
    params?.from, 
    params?.to, 
    params?.page, 
    params?.limit, 
    params?.sort
  ]);

  useEffect(() => {
    fetchJournals(params);
  }, [fetchJournals]);

  return { journals, meta, isLoading, error, refetch: fetchJournals };
}
