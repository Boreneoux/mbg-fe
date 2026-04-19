'use client';

import { useEffect, useState } from 'react';
import { ProductCategory } from '@/features/products/types';
import { getCategoriesApi } from '@/features/products/api/getCategories.api';

type ApiErr = { data?: { message?: string } };

export function useCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategoriesApi();
        setCategories(data);
      } catch (err) {
        const message = (err as ApiErr)?.data?.message ?? 'Failed to fetch categories';
        setError(message);
        // Fallback to empty array to prevent blocking
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}
