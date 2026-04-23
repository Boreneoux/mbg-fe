import { useState, useEffect, useCallback } from 'react';
import { getInventoriesApi, GetInventoriesParams } from '../api/getInventories.api';
import { StoreInventory } from '../types';
import axios from 'axios';

export function useInventories(params?: GetInventoriesParams) {
  const [inventories, setInventories] = useState<StoreInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventories = useCallback(async (currentParams?: GetInventoriesParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInventoriesApi(currentParams || params);
      setInventories(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch inventories');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [params?.store_id, params?.product_id]);

  useEffect(() => {
    fetchInventories(params);
  }, [fetchInventories]);

  return { inventories, isLoading, error, refetch: fetchInventories };
}
