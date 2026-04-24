'use client';

import { useEffect, useState } from 'react';
import { getVouchersApi, GetVouchersParams } from '../api/getVouchers.api';
import { Voucher } from '../types';

export function useVouchers(params?: GetVouchersParams) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVouchers = async (currentParams?: GetVouchersParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getVouchersApi(currentParams || params);
      setVouchers(response.data);
      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (err) {
      setError('Failed to load vouchers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers(params);
  }, [params?.page, params?.limit, params?.usage_type]);

  return { vouchers, meta, isLoading, error, refetch: fetchVouchers };
}
