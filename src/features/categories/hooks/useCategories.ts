'use client';

import { useEffect, useState } from 'react';
import { Category } from '../types';
import { getCategoriesApi } from '../api/getCategories.api';
import { isAxiosError } from 'axios';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
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
        const message = isAxiosError(err)
          ? (err.response?.data?.message ?? 'Failed to fetch categories')
          : 'An unexpected error occurred';
        setError(message);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}
