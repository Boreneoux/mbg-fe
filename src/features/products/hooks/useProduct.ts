'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/features/products/types';
import { getProductByIdApi } from '@/features/products/api/getProduct.api';

type ApiErr = { data?: { message?: string } };

export function useProduct(id: number | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProductByIdApi(id);
        setProduct(data);
      } catch (err) {
        const message = (err as ApiErr)?.data?.message ?? 'Failed to fetch product';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, isLoading, error };
}
