import { useState } from 'react';
import { adjustStockApi, AdjustStockPayload } from '../api/adjustStock.api';
import { toast } from 'sonner';
import axios from 'axios';

export function useAdjustStock() {
  const [isLoading, setIsLoading] = useState(false);

  const adjustStock = async (payload: AdjustStockPayload, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      await adjustStockApi(payload);
      toast.success('Stock adjusted successfully');
      if (onSuccess) onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Failed to adjust stock');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { adjustStock, isLoading };
}
