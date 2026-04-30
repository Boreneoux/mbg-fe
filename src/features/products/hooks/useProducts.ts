'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/features/products/types';
import { getProductsApi, GetProductsParams } from '@/features/products/api/getProducts.api';
import { PaginationMeta } from '@/types/api';
import { useDebounce } from '@/hooks/useDebounce';

const DEFAULT_LIMIT = 10;

/**
 * overrides – lets callers (e.g. public catalog page) supply their own
 * page / limit / search / category / sort without the hook managing those
 * states internally. When overrides is provided the hook is "controlled"
 * and its internal page/search state is ignored.
 */
export function useProducts(overrides?: GetProductsParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Internal state used only when no overrides are provided
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(search, 400);

  // Reset to page 1 when debounced search changes (internal mode only)
  useEffect(() => {
    if (!overrides) setPage(1);
  }, [debouncedSearch]);

  const params: GetProductsParams = overrides ?? {
    page,
    limit: DEFAULT_LIMIT,
    search: debouncedSearch || undefined,
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getProductsApi(params);
        if (!cancelled) {
          setProducts(response.data);
          if (response.meta) setMeta(response.meta);
        }
      } catch {
        if (!cancelled) setError('Failed to fetch products');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, [
    params.page,
    params.limit,
    params.search,
    params.category,
    params.sort,
    refreshKey,
  ]);

  function refetch() {
    setRefreshKey((k) => k + 1);
  }

  return { products, meta, isLoading, error, page, setPage, search, setSearch, refetch };
}
