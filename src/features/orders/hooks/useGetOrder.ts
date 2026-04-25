'use client';

import { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { Order } from '../types';
import { getOrderApi, getAdminOrderApi } from '../api/orders.api';

export function useGetOrder(id: string | number, isAdmin: boolean = false) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = isAdmin ? await getAdminOrderApi(id) : await getOrderApi(id);
      setOrder(data);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? 'Failed to load order details.'
        );
      } else {
        setError('Failed to load order details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, isAdmin]);

  return { order, isLoading, error, refetch: fetchOrder };
}
