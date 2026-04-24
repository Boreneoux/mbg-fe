'use client';

import { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { Order, OrderPaginationMeta } from '../types';
import { getOrdersApi, getAdminOrdersApi } from '../api/orders.api';

export function useGetOrders(
  page: number,
  limit: number,
  search?: string,
  status?: string,
  warehouse_id?: number | string,
  isAdmin: boolean = false
) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<OrderPaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = isAdmin 
          ? await getAdminOrdersApi(page, limit, search, status, warehouse_id)
          : await getOrdersApi(page, limit, search, status, warehouse_id);
        if (!cancelled) {
          setOrders(data.data);
          setPagination(data.meta);
        }
      } catch (err) {
        if (cancelled) return;
        if (isAxiosError(err)) {
          setError(
            err.response?.data?.message ?? 'Failed to load orders.'
          );
        } else {
          setError('Failed to load orders.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [page, limit, search, status, warehouse_id, isAdmin]);

  return { orders, isLoading, error, pagination };
}
