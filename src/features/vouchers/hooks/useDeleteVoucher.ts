'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { deleteVoucherApi } from '../api/deleteVoucher.api';

export function useDeleteVoucher(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteVoucher = async (id: number) => {
    setIsDeleting(true);
    try {
      await deleteVoucherApi(id);
      toast.success('Voucher deleted successfully');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete voucher');
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteVoucher, isDeleting };
}
