import { useState } from 'react';
import { createJournalApi, CreateJournalPayload } from '../api/createJournal.api';
import { toast } from 'sonner';
import axios from 'axios';

export function useCreateJournal() {
  const [isLoading, setIsLoading] = useState(false);

  const createJournal = async (payload: CreateJournalPayload, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      await createJournalApi(payload);
      toast.success('Journal entry created successfully');
      if (onSuccess) onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Failed to create journal entry');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { createJournal, isLoading };
}