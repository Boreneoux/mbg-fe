'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/features/products/types';
import { getProductsApi } from '@/features/products/api/getProducts.api';
import { useDebounce } from '@/hooks/useDebounce';

const SEARCH_LIMIT = 6;
const MIN_QUERY_LENGTH = 2;

export function useProductSearch(query: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim().length < MIN_QUERY_LENGTH) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchPreview() {
      setIsLoading(true);
      try {
        const response = await getProductsApi({ search: debouncedQuery.trim(), limit: SEARCH_LIMIT });
        if (!cancelled) setProducts(response.data);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPreview();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  return { products, isLoading };
}
