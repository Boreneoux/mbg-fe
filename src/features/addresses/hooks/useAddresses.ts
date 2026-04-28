'use client';

import { useState, useEffect, useCallback } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { UserAddress } from '../types';
import {
  getAddressesApi,
  deleteAddressApi,
  setPrimaryAddressApi,
} from '../api/address.api';

export function useAddresses() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAddressesApi();
      setAddresses(data);
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? 'Gagal memuat alamat')
        : 'Gagal memuat alamat';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  async function deleteAddress(id: string) {
    try {
      await deleteAddressApi(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast.success('Alamat berhasil dihapus');
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? 'Gagal menghapus alamat')
        : 'Gagal menghapus alamat';
      toast.error(message);
    }
  }

  async function setPrimary(id: string) {
    try {
      await setPrimaryAddressApi(id);
      setAddresses(prev =>
        prev
          .map(a => ({ ...a, is_primary: a.id === id }))
          .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
      );
      toast.success('Alamat utama berhasil diubah');
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? 'Gagal mengubah alamat utama')
        : 'Gagal mengubah alamat utama';
      toast.error(message);
    }
  }

  return { addresses, isLoading, error, refetch: fetchAddresses, deleteAddress, setPrimary };
}
