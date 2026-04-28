'use client';

import { useState, useEffect } from 'react';
import { getUserVouchersApi } from '../api/getUserVouchers.api';
import { UserVoucher } from '../types';

export function useUserVouchers() {
  const [userVouchers, setUserVouchers] = useState<UserVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUserVouchersApi();
        setUserVouchers(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal memuat voucher');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { userVouchers, isLoading, error };
}
