'use client';

import { useEffect, useState } from 'react';
import { Discount } from '../types';
import { getDiscountsApi } from '../api/getDiscounts.api';
import { isAxiosError } from 'axios';
import { PaginationMeta } from '@/types/api';

export function useDiscounts(params?: Record<string, any>) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = () => setRefreshKey((prev) => prev + 1);

  // We stringify params in dependency to avoid infinite loops if an inline object is passed
  const paramsString = JSON.stringify(params);

  useEffect(() => {
    const fetchDiscounts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getDiscountsApi(params);
        setDiscounts(result.data);
        setMeta(result.meta);
      } catch (err) {
        const message = isAxiosError(err)
          ? (err.response?.data?.message ?? 'Failed to fetch discounts')
          : 'An unexpected error occurred';
        setError(message);
        setDiscounts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscounts();
  }, [refreshKey, paramsString]);

  return { discounts, meta, isLoading, error, refetch };
}
