'use client';

import { useEffect } from 'react';
import { Search, Loader2, UserCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAssignAdmin } from '@/features/stores/hooks/useAssignAdmin';
import { Store } from '@/features/stores/types';

type Props = {
  store: Store | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function AssignAdminDialog({ store, onOpenChange, onSuccess }: Props) {
  const storeSlug = store?.slug ?? null;
  const assignedUserIds = new Set(
    store?.store_admins.map(sa => sa.user_id) ?? []
  );

  const {
    form,
    onSubmit,
    isSubmitting,
    users,
    isLoadingUsers,
    search,
    setSearch
  } = useAssignAdmin(storeSlug, () => {
    onSuccess();
    onOpenChange(false);
  });

  const selectedUserId = form.watch('user_id');

  useEffect(() => {
    if (!store) {
      form.reset();
      setSearch('');
    }
  }, [store, form, setSearch]);

  function getDisplayName(
    firstName: string | null,
    lastName: string | null,
    email: string
  ) {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return email;
  }

  return (
    <Dialog open={!!store} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Store Admin</DialogTitle>
          <DialogDescription>
            Select a store admin to assign to{' '}
            <span className="font-semibold text-foreground">{store?.name}</span>
            .
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* User list */}
        <div className="max-h-64 overflow-y-auto rounded-lg border border-border divide-y divide-border">
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading users…</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No store admin users found.
            </div>
          ) : (
            users.map(user => {
              const isSelected = selectedUserId === user.id;
              const isAlreadyAssigned = assignedUserIds.has(user.id);
              const displayName = getDisplayName(
                user.first_name,
                user.last_name,
                user.email
              );

              return (
                <button
                  key={user.id}
                  type="button"
                  disabled={isAlreadyAssigned}
                  onClick={() => form.setValue('user_id', user.id)}
                  className={[
                    'w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors',
                    isSelected && !isAlreadyAssigned
                      ? 'bg-primary/10'
                      : 'hover:bg-secondary',
                    isAlreadyAssigned ? 'opacity-50 cursor-not-allowed' : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  {isAlreadyAssigned ? (
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      Assigned
                    </Badge>
                  ) : isSelected ? (
                    <UserCheck className="h-4 w-4 shrink-0 text-primary" />
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        {form.formState.errors.user_id && (
          <p className="text-xs text-destructive">
            {form.formState.errors.user_id.message}
          </p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting || !selectedUserId}>
            {isSubmitting ? 'Assigning…' : 'Assign Admin'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
