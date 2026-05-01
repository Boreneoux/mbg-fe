'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { deleteVoucherApi } from '../api/deleteVoucher.api';

export function useDeleteVoucher(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteVoucher = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteVoucherApi(id);
      toast.success('Voucher deleted successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? 'Failed to delete voucher')
        : 'Failed to delete voucher';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteVoucher, isDeleting };
}
