'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Edit2, Trash2, Plus } from 'lucide-react';
import { UserWithStore, UserPaginationMeta } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';

interface UserListTableProps {
  users: UserWithStore[];
  pagination: UserPaginationMeta;
  isLoading: boolean;
  search: string;
  roleFilter: 'store_admin' | 'user' | undefined;
  onSearchChange: (search: string) => void;
  onRoleFilterChange: (role: 'store_admin' | 'user' | undefined) => void;
  onPageChange: (page: number) => void;
  onEdit: (user: UserWithStore) => void;
  onDelete: (user: UserWithStore) => void;
  onAddUser: () => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getRoleBadgeColor(role: string) {
  if (role === 'store_admin') return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
}

function getRoleLabel(role: string) {
  if (role === 'store_admin') return 'Store Admin';
  return 'User';
}

export function UserListTable({
  users,
  pagination,
  isLoading,
  search,
  roleFilter,
  onSearchChange,
  onRoleFilterChange,
  onPageChange,
  onEdit,
  onDelete,
  onAddUser,
}: UserListTableProps) {
  const [searchInput, setSearchInput] = useState(search);
  const onSearchChangeRef = useRef(onSearchChange);

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChangeRef.current(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const displayName = (firstName: string | null, lastName: string | null) => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return 'N/A';
  };

  const getStoreNames = (user: UserWithStore) => {
    if (!user.store_admins?.length) return null;
    return user.store_admins.map((sa) => sa.store.name);
  };

  return (
    <div className="space-y-4">
      {/* Filters Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
          />
          <Select
            value={roleFilter || 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                onRoleFilterChange(undefined);
              } else {
                onRoleFilterChange(value as 'store_admin' | 'user');
              }
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="store_admin">Store Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onAddUser} className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{displayName(user.first_name, user.last_name)}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>
                    {(() => {
                      const names = getStoreNames(user);
                      if (!names) return '-';
                      return (
                        <div className="flex flex-wrap gap-1">
                          {names.map((name) => (
                            <Badge key={name} variant="outline" className="text-xs">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.is_verified ? 'default' : 'secondary'}
                    >
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(user)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(user)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    pagination.page > 1 && onPageChange(pagination.page - 1)
                  }
                  className={
                    pagination.page === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {Array.from({ length: pagination.totalPages }).map(
                (_, index) => {
                  const pageNum = index + 1;
                  const isActive = pageNum === pagination.page;

                  if (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= pagination.page - 1 &&
                      pageNum <= pagination.page + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => onPageChange(pageNum)}
                          isActive={isActive}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    pageNum === pagination.page - 2 ||
                    pageNum === pagination.page + 2
                  ) {
                    return (
                      <PaginationItem key={pageNum}>
                        <span className="px-1">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    pagination.page < pagination.totalPages &&
                    onPageChange(pagination.page + 1)
                  }
                  className={
                    pagination.page >= pagination.totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
