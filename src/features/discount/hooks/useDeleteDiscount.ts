'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { deleteDiscountApi } from '../api/deleteDiscount.api';

export function useDeleteDiscount(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteDiscount = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteDiscountApi(id);
      toast.success('Discount deleted successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? 'Failed to delete discount')
        : 'Failed to delete discount';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteDiscount, isDeleting };
}
