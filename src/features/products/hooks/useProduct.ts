'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/features/products/types';
import { getProductBySlugApi } from '@/features/products/api/getProduct.api';

type ApiErr = { data?: { message?: string } };

export function useProduct(slug: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProductBySlugApi(slug);
        setProduct(data);
      } catch (err) {
        const message = (err as ApiErr)?.data?.message ?? 'Failed to fetch product';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, isLoading, error };
}
