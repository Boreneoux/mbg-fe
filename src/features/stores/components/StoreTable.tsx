'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, UserPlus, Trash2, MapPin, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AssignAdminDialog } from './AssignAdminDialog';
import { DeleteStoreDialog } from './DeleteStoreDialog';
import { Store, StorePaginationMeta } from '@/features/stores/types';

type Props = {
  stores: Store[];
  isLoading: boolean;
  onRefetch: () => void;
  pagination: StorePaginationMeta;
  page: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

type DialogState =
  | { type: 'assign'; store: Store }
  | { type: 'delete'; store: Store }
  | null;

function getAdminNames(store: Store) {
  return (store.store_admins ?? [])
    .filter((sa) => !sa.deleted_at)
    .map((sa) => {
      const { first_name, last_name, email } = sa.user;
      if (first_name && last_name) return `${first_name} ${last_name}`;
      if (first_name) return first_name;
      return email;
    });
}

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total];
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

export function StoreTable({
  stores,
  isLoading,
  onRefetch,
  pagination,
  page,
  onPageChange,
  search,
  onSearchChange,
}: Props) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogState>(null);

  const pageNumbers = buildPageNumbers(page, pagination.totalPages);

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stores</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all store locations and their admins.
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/stores/create')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Store
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stores..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="font-semibold">Store</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Admins</TableHead>
              <TableHead className="font-semibold text-right">Max Distance</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : stores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                  {search
                    ? `No stores found for "${search}".`
                    : 'No stores yet. Click "Add Store" to get started.'}
                </TableCell>
              </TableRow>
            ) : (
              stores.map((store) => {
                const admins = getAdminNames(store);
                return (
                  <TableRow key={store.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <p className="font-medium">{store.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {store.address}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="text-sm">
                          <p>{store.city.name}</p>
                          <p className="text-xs text-muted-foreground">{store.province.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {admins.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">Unassigned</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {admins.slice(0, 2).map((name) => (
                            <Badge key={name} variant="secondary" className="text-xs font-normal">
                              {name}
                            </Badge>
                          ))}
                          {admins.length > 2 && (
                            <Badge variant="outline" className="text-xs font-normal">
                              +{admins.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {store.max_delivery_distance} km
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => router.push(`/dashboard/stores/${store.id}/edit`)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit store</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setDialog({ type: 'assign', store })}
                            >
                              <UserPlus className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Assign admin</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDialog({ type: 'delete', store })}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete store</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pagination.limit + 1}–
            {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} stores
          </p>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(page - 1)}
                  aria-disabled={page === 1}
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {pageNumbers.map((p, i) =>
                p === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => onPageChange(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(page + 1)}
                  aria-disabled={page === pagination.totalPages}
                  className={page === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Dialogs */}
      <AssignAdminDialog
        store={dialog?.type === 'assign' ? dialog.store : null}
        onOpenChange={(open) => { if (!open) setDialog(null); }}
        onSuccess={onRefetch}
      />

      <DeleteStoreDialog
        store={dialog?.type === 'delete' ? dialog.store : null}
        onOpenChange={(open) => { if (!open) setDialog(null); }}
        onSuccess={onRefetch}
      />
    </div>
  );
}
