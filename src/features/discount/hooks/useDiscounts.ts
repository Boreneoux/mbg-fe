'use client';

import { useEffect, useState } from 'react';
import { getDiscountsApi, GetDiscountsParams } from '../api/getDiscounts.api';
import { Discount } from '../types';

export function useDiscounts(params?: GetDiscountsParams) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscounts = async (currentParams?: GetDiscountsParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDiscountsApi(currentParams || params);
      setDiscounts(response.data);
      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (err) {
      setError('Failed to load discounts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts(params);
  }, [params?.page, params?.limit, params?.store_id, params?.product_id, params?.is_active]);

  return { discounts, meta, isLoading, error, refetch: fetchDiscounts };
}
