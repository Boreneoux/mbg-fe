'use client';

import { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { Order } from '../types';
import { getOrderApi } from '../api/orders.api';

export function useGetOrder(id: string | number) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    let cancelled = false;

    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getOrderApi(id);
        if (!cancelled) {
          setOrder(data);
        }
      } catch (err) {
        if (cancelled) return;
        if (isAxiosError(err)) {
          setError(
            err.response?.data?.message ?? 'Failed to load order details.'
          );
        } else {
          setError('Failed to load order details.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { order, isLoading, error };
}
