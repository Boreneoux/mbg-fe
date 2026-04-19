'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { deleteProductApi } from '@/features/products/api/deleteProduct.api';

type ApiErr = { data?: { message?: string } };

export function useDeleteProduct(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProduct = async (id: number) => {
    setIsDeleting(true);
    try {
      await deleteProductApi(id);
      toast.success('Product deleted successfully');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const message = (err as ApiErr)?.data?.message ?? 'Failed to delete product';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteProduct, isDeleting };
}
