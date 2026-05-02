'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Trash2, Edit, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Category } from '@/features/categories/types';

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total];
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  error?: string | null;
  onDelete?: (slug: string) => Promise<void>;
  canEdit?: boolean;
  canDelete?: boolean;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
  page?: number;
  onPageChange?: (page: number) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
}

export function CategoryList({
  categories,
  isLoading,
  error,
  onDelete,
  canEdit = true,
  canDelete = true,
  pagination,
  page = 1,
  onPageChange,
  search = '',
  onSearchChange,
}: CategoryListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageNumbers = pagination ? buildPageNumbers(page, pagination.totalPages) : [];

  const handleDeleteConfirm = async (slug: string) => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(slug);
      setDeletingId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-900">Error loading categories</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onSearchChange && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-24" />
          </div>
        ))
      ) : categories.length === 0 ? (
        <div className="col-span-full border border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">
            {search ? `No categories found for "${search}".` : 'No categories found'}
          </p>
          {canEdit && !search && (
            <Link href="/dashboard/categories/create">
              <Button>Create First Category</Button>
            </Link>
          )}
        </div>
      ) : (
        categories.map(category => (
          <div
            key={category.id}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* Photo */}
            {category.image_url && (
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                {category.name}
              </h3>

              {/* Actions */}
              {(canEdit || canDelete) && (
                <div className="flex gap-2 pt-2">
                  {canEdit && (
                    <Link
                      href={`/dashboard/categories/${category.slug}`}
                      className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  )}

                  {canDelete && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingId(category.slug)}
                        className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      {/* Delete Confirmation Dialog */}
                      <AlertDialog
                        open={deletingId === category.slug}
                        onOpenChange={() => setDeletingId(null)}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "
                              <strong>{category.name}</strong>"? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="flex gap-3">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteConfirm(category.slug)}
                              disabled={isDeleting}
                              className="bg-red-600 hover:bg-red-700">
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      )}
      </div>

      {pagination && pagination.totalPages > 1 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pagination.limit + 1}–
            {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} categories
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
                      onClick={() => onPageChange(p as number)}
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
    </div>
  );
}
