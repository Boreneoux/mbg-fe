'use client';

import { useEffect, useState } from 'react';
import { Category } from '../types';
import { getCategoryDetailApi } from '../api/getCategoryDetail.api';
import { isAxiosError } from 'axios';

export function useCategory(id: number) {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchCategory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategoryDetailApi(id);
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
  }, [id]);

  return { category, isLoading, error };
}
