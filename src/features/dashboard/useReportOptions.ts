'use client';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Category } from '@/features/categories/types';
import { Product } from '@/features/products/types';
import { Store } from '@/features/stores/types';
import {
  getReportCategoriesApi,
  getReportProductsApi,
  getReportStoresApi,
} from '@/features/dashboard/report.api';

type UseReportOptionsResult = {
  stores: Store[];
  categories: Category[];
  products: Product[];
  isLoading: boolean;
};

export function useReportOptions(): UseReportOptionsResult {
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function fetchOptions() {
      setIsLoading(true);

      try {
        const [storesResult, categoriesResult, productsResult] = await Promise.all([
          getReportStoresApi(),
          getReportCategoriesApi(),
          getReportProductsApi(),
        ]);

        if (isCancelled) {
          return;
        }

        setStores(storesResult);
        setCategories(categoriesResult);
        setProducts(productsResult);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message = isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? 'Failed to load report filters')
          : 'Failed to load report filters';

        toast.error(message);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchOptions();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { stores, categories, products, isLoading };
}
