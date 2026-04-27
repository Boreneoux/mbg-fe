'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Plus, X, Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { useGetUserById } from '../hooks/useGetUserById';
import { useGetStores } from '../hooks/useGetStores';
import { assignStoreAdminApi, unassignStoreAdminApi } from '../api/stores.api';
import { StoreOption } from '../types';

interface EditUserFormProps {
  userId: number;
}

export function EditUserForm({ userId }: EditUserFormProps) {
  const router = useRouter();
  const { user, isLoading: isFetching, error: fetchError } = useGetUserById(userId);
  const { form, onSubmit, isLoading: isSaving } = useUpdateUser(userId, () => {
    router.push('/dashboard/users');
  });
  const { stores } = useGetStores();

  const [assignedStores, setAssignedStores] = useState<StoreOption[]>([]);
  const [processingStoreIds, setProcessingStoreIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) return;
    form.reset({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      is_verified: user.is_verified,
      role: user.role as 'store_admin' | 'user',
    });
    setAssignedStores(
      (user.store_admins ?? []).map((sa) => ({ id: sa.store.id, name: sa.store.name }))
    );
  }, [user, form]);

  const setProcessing = (storeId: number, processing: boolean) => {
    setProcessingStoreIds((prev) => {
      const next = new Set(prev);
      if (processing) next.add(storeId);
      else next.delete(storeId);
      return next;
    });
  };

  const handleAssign = async (store: StoreOption) => {
    setProcessing(store.id, true);
    try {
      await assignStoreAdminApi(store.id, userId);
      setAssignedStores((prev) => [...prev, store]);
      toast.success(`Assigned to ${store.name}`);
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? 'Failed to assign store')
        : 'Failed to assign store';
      toast.error(message);
    } finally {
      setProcessing(store.id, false);
    }
  };

  const handleUnassign = async (store: StoreOption) => {
    setProcessing(store.id, true);
    try {
      await unassignStoreAdminApi(store.id, userId);
      setAssignedStores((prev) => prev.filter((s) => s.id !== store.id));
      toast.success(`Removed from ${store.name}`);
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data?.message ?? 'Failed to remove store')
        : 'Failed to remove store';
      toast.error(message);
    } finally {
      setProcessing(store.id, false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-xl space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (fetchError || !user) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
        {fetchError ?? 'User not found.'}
      </div>
    );
  }

  const assignedIds = new Set(assignedStores.map((s) => s.id));
  const availableStores = stores.filter((s) => !assignedIds.has(s.id));

  return (
    <div className="space-y-6 max-w-xl">
      {/* Basic info card */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h2 className="text-base font-semibold mb-4">Basic Information</h2>

        <Form {...form}>
          <form id="edit-user-form" onSubmit={onSubmit} className="space-y-5">
            {form.formState.errors.root && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="rounded-md bg-muted px-3 py-2 text-sm">
              <span className="font-medium">Email:</span> {user.email}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        value={field.value || ''}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+62 812345678"
                      {...field}
                      value={field.value || ''}
                      disabled={isSaving}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSaving}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="store_admin">Store Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_verified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSaving}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Mark as verified</FormLabel>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      {/* Store assignment card — only for store_admin */}
      {user.role === 'store_admin' && (
        <div className="rounded-lg border border-border bg-white p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold">Store Assignments</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage which stores this admin is assigned to.
            </p>
          </div>

          <Separator className="mb-4" />

          <div className="grid grid-cols-2 gap-4">
            {/* Assigned panel */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Assigned ({assignedStores.length})
              </p>
              <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                {assignedStores.length === 0 ? (
                  <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
                    No stores assigned
                  </p>
                ) : (
                  assignedStores.map((store) => (
                    <div
                      key={store.id}
                      className="flex items-center justify-between rounded-md border bg-background px-2.5 py-1.5"
                    >
                      <span className="text-xs font-medium truncate mr-1">{store.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 shrink-0 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        disabled={processingStoreIds.has(store.id)}
                        onClick={() => handleUnassign(store)}
                      >
                        {processingStoreIds.has(store.id)
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <X className="h-3 w-3" />}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Available panel */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Available ({availableStores.length})
              </p>
              <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                {availableStores.length === 0 ? (
                  <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
                    All stores assigned
                  </p>
                ) : (
                  availableStores.map((store) => (
                    <div
                      key={store.id}
                      className="flex items-center justify-between rounded-md border bg-background px-2.5 py-1.5"
                    >
                      <span className="text-xs font-medium truncate mr-1">{store.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 shrink-0 p-0 text-green-600 hover:text-green-800 hover:bg-green-50"
                        disabled={processingStoreIds.has(store.id)}
                        onClick={() => handleAssign(store)}
                      >
                        {processingStoreIds.has(store.id)
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <Plus className="h-3 w-3" />}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {assignedStores.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t">
              {assignedStores.map((s) => (
                <Badge key={s.id} variant="secondary" className="text-xs">
                  {s.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/users')}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="submit" form="edit-user-form" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
