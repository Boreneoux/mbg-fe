'use client';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Plus, X, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
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
import { useUpdateUser } from '../hooks/useUpdateUser';
import { useGetStores } from '../hooks/useGetStores';
import { assignStoreAdminApi, unassignStoreAdminApi } from '../api/stores.api';
import { UserWithStore, StoreOption } from '../types';

interface EditUserDialogProps {
  open: boolean;
  user: UserWithStore | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (user: UserWithStore) => void;
  onAssignmentChange?: () => void;
}

export function EditUserDialog({
  open,
  user,
  onOpenChange,
  onSuccess,
  onAssignmentChange,
}: EditUserDialogProps) {
  const { form, onSubmit, isLoading } = useUpdateUser(user?.id ?? '', onSuccess);
  const { stores } = useGetStores();

  // Local state mirroring the user's current store assignments so UI updates
  // immediately without waiting for a list refresh.
  const [assignedStores, setAssignedStores] = useState<StoreOption[]>([]);
  const [processingStoreIds, setProcessingStoreIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open && user) {
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
    }
  }, [open, user, form]);

  const handleClose = () => {
    if (!isLoading) onOpenChange(false);
  };

  if (!user) return null;

  const displayName = user.first_name
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`
    : user.email;

  const assignedIds = new Set(assignedStores.map((s) => s.id));
  const availableStores = stores.filter((s) => !assignedIds.has(s.id));

  const setProcessing = (storeId: string, processing: boolean) => {
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
      await assignStoreAdminApi(store.id, user.id);
      setAssignedStores((prev) => [...prev, store]);
      toast.success(`Assigned to ${store.name}`);
      onAssignmentChange?.();
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? 'Failed to assign store'
        : 'Failed to assign store';
      toast.error(message);
    } finally {
      setProcessing(store.id, false);
    }
  };

  const handleUnassign = async (store: StoreOption) => {
    setProcessing(store.id, true);
    try {
      await unassignStoreAdminApi(store.id, user.id);
      setAssignedStores((prev) => prev.filter((s) => s.id !== store.id));
      toast.success(`Removed from ${store.name}`);
      onAssignmentChange?.();
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? 'Failed to remove store'
        : 'Failed to remove store';
      toast.error(message);
    } finally {
      setProcessing(store.id, false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>
            Update information for {displayName}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 py-4">
          {/* Basic info form */}
          <Form {...form}>
            <form id="edit-user-form" onSubmit={onSubmit} className="space-y-4">
              {form.formState.errors.root && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
              </div>

              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} disabled={isLoading} />
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
                    <FormLabel>Last Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        value={field.value || ''}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+62 812345678"
                        {...field}
                        value={field.value || ''}
                        disabled={isLoading}
                      />
                    </FormControl>
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
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Mark as verified</FormLabel>
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
                      disabled={isLoading}
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
            </form>
          </Form>

          {/* Store assignment section — only for store_admin */}
          {user.role === 'store_admin' && (
            <>
              <Separator />
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold">Store Assignments</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage which stores this admin is assigned to.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Assigned panel */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Assigned ({assignedStores.length})
                    </p>
                    <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
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
                            <span className="text-xs font-medium truncate mr-1">
                              {store.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 shrink-0 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              disabled={processingStoreIds.has(store.id)}
                              onClick={() => handleUnassign(store)}
                            >
                              {processingStoreIds.has(store.id) ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
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
                    <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
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
                            <span className="text-xs font-medium truncate mr-1">
                              {store.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 shrink-0 p-0 text-green-600 hover:text-green-800 hover:bg-green-50"
                              disabled={processingStoreIds.has(store.id)}
                              onClick={() => handleAssign(store)}
                            >
                              {processingStoreIds.has(store.id) ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Plus className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Assignment count summary */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {assignedStores.map((s) => (
                    <Badge key={s.id} variant="secondary" className="text-xs">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="shrink-0 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-user-form" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
