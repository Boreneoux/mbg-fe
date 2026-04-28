'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { deleteStoreApi } from '@/features/stores/api/deleteStore.api';

type ApiErr = { data?: { message?: string } };

export function useDeleteStore(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteStore(slug: string) {
    setIsDeleting(true);
    try {
      await deleteStoreApi(slug);
      toast.success('Store deleted successfully');
      onSuccess?.();
    } catch (err) {
      const message = (err as ApiErr)?.data?.message ?? 'Failed to delete store';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return { deleteStore, isDeleting };
}
