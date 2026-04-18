'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { UserWithStore } from '../types';

interface DeleteUserConfirmDialogProps {
  open: boolean;
  user: UserWithStore | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteUserConfirmDialog({
  open,
  user,
  onOpenChange,
  onSuccess,
}: DeleteUserConfirmDialogProps) {
  const { execute, isLoading } = useDeleteUser(onSuccess);

  const handleDelete = async () => {
    if (user) {
      try {
        await execute(user.id);
        onOpenChange(false);
      } catch (err) {
        // Error already handled in hook
      }
    }
  };

  if (!user) return null;

  const displayName = user.first_name
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`
    : user.email;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{displayName}</span> ({user.email})? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
