'use client';

import { Discount } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { formatCurrencyIDR } from '@/utils/currency';

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total];
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

interface DiscountListProps {
  discounts: Discount[];
  isLoading: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (discount: Discount) => void;
  onToggleActive?: (id: number, currentStatus: boolean) => void;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
  page?: number;
  onPageChange?: (page: number) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
}

export function DiscountList({ 
  discounts, 
  isLoading, 
  onDelete, 
  onEdit, 
  onToggleActive,
  pagination,
  page = 1,
  onPageChange,
  search = '',
  onSearchChange,
}: DiscountListProps) {
  const pageNumbers = pagination ? buildPageNumbers(page, pagination.totalPages) : [];
  return (
    <div className="space-y-4">
      {onSearchChange && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discounts..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      )}
      <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Min. Purchase</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((__, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : discounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                {search ? `No discounts found for "${search}".` : 'No discounts found.'}
              </TableCell>
            </TableRow>
          ) : (
            discounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell>{discount.store?.name || 'Unknown'}</TableCell>
                <TableCell className="capitalize">{discount.type.replace(/_/g, ' ')}</TableCell>
                <TableCell>{discount.product?.name || <span className="text-gray-400">Store-wide</span>}</TableCell>
                <TableCell>
                  {discount.type === 'buy_one_get_one' ? (
                    '-'
                  ) : discount.type === 'percentage' ? (
                    `${discount.value}%`
                  ) : (
                    formatCurrencyIDR(Number(discount.value))
                  )}
                </TableCell>
                <TableCell>
                  {discount.min_purchase_amount 
                    ? formatCurrencyIDR(Number(discount.min_purchase_amount))
                    : '-'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${discount.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {discount.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {onToggleActive && (
                    <button 
                      onClick={() => onToggleActive(discount.id, discount.is_active)}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      {discount.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(discount)}
                      className="text-xs text-blue-500 hover:text-blue-700 underline"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(discount.id)}
                      className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Delete
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>

      {pagination && pagination.totalPages > 1 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pagination.limit + 1}–
            {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} discounts
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
