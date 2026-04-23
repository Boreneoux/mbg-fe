import { useState, useEffect, useCallback } from 'react';
import { getInventoriesApi, GetInventoriesParams } from '../api/getInventories.api';
import { StoreInventory } from '../types';
import axios from 'axios';

export function useInventories(params?: GetInventoriesParams) {
  const [inventories, setInventories] = useState<StoreInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchInventories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getInventoriesApi(params);
        if (!cancelled) {
          setInventories(data);
        }
      } catch (err) {
        if (cancelled) return;
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch inventories');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchInventories();
    return () => { cancelled = true; };
  }, [params?.store_id, params?.product_id, refreshKey]);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { inventories, isLoading, error, refetch };
}
