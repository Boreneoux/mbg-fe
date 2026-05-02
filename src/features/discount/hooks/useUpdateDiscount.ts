'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { updateDiscountApi } from '../api/updateDiscount.api';
import { CreateDiscountFormValues } from '../schemas/discount.schema';

export function useUpdateDiscount(onSuccess?: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateDiscount = async (id: string, data: Partial<CreateDiscountFormValues> & { is_active?: boolean }) => {
    setIsUpdating(true);
    try {
      await updateDiscountApi(id, data);
      toast.success('Discount updated successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? 'Failed to update discount')
        : 'Failed to update discount';
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateDiscount, isUpdating };
}
