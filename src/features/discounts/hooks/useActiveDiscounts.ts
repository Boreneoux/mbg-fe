'use client';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { getDiscountsApi } from '@/features/discounts/api/getDiscounts.api';
import type { Discount } from '@/features/discounts/types';

const PAGE_LIMIT = 100;

export function useActiveDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDiscounts() {
      setIsLoading(true);
      setError(null);

      try {
        const collectedDiscounts: Discount[] = [];
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
          const response = await getDiscountsApi({
            page: currentPage,
            limit: PAGE_LIMIT,
            is_active: true,
          });

          collectedDiscounts.push(...response.data);
          totalPages = response.meta.totalPages;
          currentPage += 1;
        }

        if (!cancelled) {
          setDiscounts(collectedDiscounts);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? 'Failed to fetch discounts')
          : 'Failed to fetch discounts';

        setError(message);
        setDiscounts([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchDiscounts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { discounts, isLoading, error };
}
