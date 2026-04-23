'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/features/products/types';
import { getProductsApi, GetProductsParams } from '@/features/products/api/getProducts.api';

type ApiErr = { data?: { message?: string } };

export function useProducts(params?: GetProductsParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (currentParams?: GetProductsParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProductsApi(currentParams || params);
      setProducts(response.data);
      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (err) {
      const message = (err as ApiErr)?.data?.message ?? 'Failed to fetch products';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(params);
  }, [params?.page, params?.limit, params?.search, params?.category, params?.sort]);

  return { products, meta, isLoading, error, refetch: fetchProducts };
}
