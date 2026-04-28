'use client';

import { useEffect, useState } from 'react';
import { Category } from '../types';
import { getCategoryDetailApi } from '../api/getCategoryDetail.api';
import { isAxiosError } from 'axios';

export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    const fetchCategory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategoryDetailApi(slug);
        setCategory(data);
      } catch (err) {
        const message = isAxiosError(err)
          ? (err.response?.data?.message ?? 'Failed to fetch category')
          : 'An unexpected error occurred';
        setError(message);
        setCategory(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, isLoading, error };
}
