'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/features/products/types';
import { getProductsApi } from '@/features/products/api/getProducts.api';

type ApiErr = { data?: { message?: string } };

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProductsApi();
      setProducts(data);
    } catch (err) {
      const message = (err as ApiErr)?.data?.message ?? 'Failed to fetch products';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, isLoading, error, refetch: fetchProducts };
}
