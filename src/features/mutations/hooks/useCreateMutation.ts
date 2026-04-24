import { useState } from 'react';
import { createMutationApi, CreateMutationPayload } from '../api/createMutation.api';
import { toast } from 'sonner';
import axios from 'axios';

export function useCreateMutation() {
  const [isLoading, setIsLoading] = useState(false);

  const createMutation = async (payload: CreateMutationPayload, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      await createMutationApi(payload);
      toast.success('Stock mutation executed successfully');
      if (onSuccess) onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Failed to execute stock mutation');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { createMutation, isLoading };
}
