import { useState, useEffect, useCallback } from 'react';
import { getJournalsApi } from '../api/getJournals.api';
import { StockJournal, StockJournalType } from '../types';
import axios from 'axios';
import { PaginationMeta } from '@/types/api';
import { useDebounce } from '@/hooks/useDebounce';

const LIMIT = 10;

// storeId and journalType are external filters; search/page are internal
export function useJournals(storeId?: string, journalType?: StockJournalType) {
  const [journals, setJournals] = useState<StockJournal[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: LIMIT, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(search, 400);

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, storeId, journalType]);

  useEffect(() => {
    let cancelled = false;

    const fetchJournals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getJournalsApi({
          store_id: storeId,
          type: journalType,
          page,
          limit: LIMIT,
          search: debouncedSearch || undefined,
        });
        if (!cancelled) {
          setJournals(data.journals);
          if (data.meta) setMeta(data.meta);
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
  }, [storeId, journalType, page, debouncedSearch, refreshKey]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { journals, meta, isLoading, error, page, setPage, search, setSearch, refetch };
}
