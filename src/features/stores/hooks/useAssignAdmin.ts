'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  assignAdminSchema,
  AssignAdminFormValues
} from '@/features/stores/schemas/store.schema';
import { assignAdminApi } from '@/features/stores/api/assignAdmin.api';
import { getStoreAdminUsersApi } from '@/features/stores/api/getStoreAdminUsers.api';
import { EligibleStoreAdminUser } from '@/features/stores/types';

type ApiErr = { data?: { message?: string } };

export function useAssignAdmin(storeId: number | null, onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<EligibleStoreAdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [search, setSearch] = useState('');

  const form = useForm<AssignAdminFormValues>({
    resolver: zodResolver(assignAdminSchema)
  });

  const fetchUsers = useCallback(async (query: string) => {
    setIsLoadingUsers(true);
    try {
      const { users: data } = await getStoreAdminUsersApi({
        search: query || undefined
      });
      setUsers(data);
    } catch (err) {
      const message = (err as ApiErr)?.data?.message ?? 'Failed to load users';
      toast.error(message);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (storeId !== null) {
      fetchUsers(search);
    }
  }, [storeId, search, fetchUsers]);

  const onSubmit = form.handleSubmit(async values => {
    if (!storeId) return;
    setIsSubmitting(true);
    try {
      await assignAdminApi(storeId, values.user_id);
      toast.success('Admin assigned to store');
      form.reset();
      onSuccess?.();
    } catch (err) {
      const message =
        (err as ApiErr)?.data?.message ?? 'Failed to assign admin';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting,
    users,
    isLoadingUsers,
    search,
    setSearch
  };
}
