'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import { useGetUsers } from '@/features/user-management/hooks/useGetUsers';
import { UserListTable } from '@/features/user-management/components/UserListTable';
import { CreateUserDialog } from '@/features/user-management/components/CreateUserDialog';
import { EditUserDialog } from '@/features/user-management/components/EditUserDialog';
import { DeleteUserConfirmDialog } from '@/features/user-management/components/DeleteUserConfirmDialog';
import { UserWithStore } from '@/features/user-management/types';

export default function UsersPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  // Route protection
  if (user && user.role !== 'super_admin') {
    router.push('/dashboard');
    return null;
  }

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'store_admin' | 'user' | undefined>();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithStore | null>(null);

  const { users, isLoading, pagination } = useGetUsers(
    page,
    limit,
    search,
    roleFilter
  );

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    setPage(1);
  };

  const handleEditOpen = (user: UserWithStore) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteOpen = (user: UserWithStore) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage Store Admin and regular user accounts
        </p>
      </div>

      <UserListTable
        users={users}
        pagination={pagination}
        isLoading={isLoading}
        search={search}
        roleFilter={roleFilter}
        onSearchChange={setSearch}
        onRoleFilterChange={setRoleFilter}
        onPageChange={setPage}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
        onAddUser={() => setCreateDialogOpen(true)}
      />

      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      <EditUserDialog
        open={editDialogOpen}
        user={selectedUser}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      <DeleteUserConfirmDialog
        open={deleteDialogOpen}
        user={selectedUser}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
