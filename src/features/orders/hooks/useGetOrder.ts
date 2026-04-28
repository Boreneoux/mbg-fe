'use client';

import { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { Order } from '../types';
import { getOrderApi, getAdminOrderApi } from '../api/orders.api';

export function useGetOrder(orderNumber: string, isAdmin: boolean = false) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!orderNumber) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = isAdmin ? await getAdminOrderApi(orderNumber) : await getOrderApi(orderNumber);
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
  }, [orderNumber, isAdmin]);

  return { order, isLoading, error, refetch: fetchOrder };
}
