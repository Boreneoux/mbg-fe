'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateDiscountApi } from '../api/updateDiscount.api';
import { CreateDiscountFormValues } from '../schemas/discount.schema';

export function useUpdateDiscount(onSuccess?: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateDiscount = async (id: number, data: Partial<CreateDiscountFormValues> & { is_active?: boolean }) => {
    setIsUpdating(true);
    try {
      await updateDiscountApi(id, data);
      toast.success('Discount updated successfully');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update discount');
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateDiscount, isUpdating };
}
