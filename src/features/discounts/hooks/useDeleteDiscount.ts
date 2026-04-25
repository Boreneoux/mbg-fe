'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { deleteDiscountApi } from '../api/deleteDiscount.api';

export function useDeleteDiscount(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteDiscount = async (id: number) => {
    setIsDeleting(true);
    try {
      await deleteDiscountApi(id);
      toast.success('Discount deleted successfully');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete discount');
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteDiscount, isDeleting };
}
