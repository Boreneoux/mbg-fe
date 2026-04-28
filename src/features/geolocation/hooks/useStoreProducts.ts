import { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { Product } from '@/features/products/types';
import { getStoreProductsApi } from '@/features/geolocation/api/store-products.api';

export function useStoreProducts(storeSlug: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeSlug) return;

    let cancelled = false;

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getStoreProductsApi(storeSlug);
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (cancelled) return;
        if (isAxiosError(err)) {
          setError(err.response?.data?.message ?? 'Failed to load products.');
        } else {
          setError('Failed to load products.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [storeSlug]);

  return { products, isLoading, error };
}
