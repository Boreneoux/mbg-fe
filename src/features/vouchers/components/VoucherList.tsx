'use client';

import { Voucher } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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
import { Search, Pencil, Trash2, UserPlus, Gift } from 'lucide-react';
import { formatCurrencyIDR } from '@/utils/currency';
import { Button } from '@/components/ui/button';

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total];
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

interface VoucherListProps {
  vouchers: Voucher[];
  isLoading: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (voucher: Voucher) => void;
  onSetReferral?: (id: number) => void;
  onSetReferrerReward?: (id: number) => void;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
  page?: number;
  onPageChange?: (page: number) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
}

export function VoucherList({ 
  vouchers, 
  isLoading, 
  onDelete, 
  onEdit, 
  onSetReferral, 
  onSetReferrerReward,
  pagination,
  page = 1,
  onPageChange,
  search = '',
  onSearchChange,
}: VoucherListProps) {
  const pageNumbers = pagination ? buildPageNumbers(page, pagination.totalPages) : [];
  return (
    <div className="space-y-4">
      {onSearchChange && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vouchers..."
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
            <TableHead>Code</TableHead>
            <TableHead>Usage Type</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Min. Spend</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Target</TableHead>
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
          ) : vouchers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                {search ? `No vouchers found for "${search}".` : 'No vouchers found.'}
              </TableCell>
            </TableRow>
          ) : (
            vouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell className="font-bold">
                  <div className="flex items-center gap-2">
                    {voucher.code}
                    {voucher.is_referral && (
                      <Badge variant="secondary" className="text-xs">Referral</Badge>
                    )}
                    {voucher.is_referrer_reward && (
                      <Badge variant="secondary" className="text-xs">Referrer Reward</Badge>
                    )}
                    {voucher.reward_duration_days && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">{voucher.reward_duration_days}d</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{voucher.usage_type.replace(/_/g, ' ')}</TableCell>
                <TableCell>
                  {voucher.discount_type === 'percentage' 
                    ? `${voucher.discount_value}%` 
                    : formatCurrencyIDR(Number(voucher.discount_value))}
                </TableCell>
                <TableCell>
                  {voucher.min_purchase_amount 
                    ? formatCurrencyIDR(Number(voucher.min_purchase_amount)) 
                    : '-'}
                </TableCell>
                <TableCell>{new Date(voucher.expired_at).toLocaleDateString()}</TableCell>
                <TableCell>{voucher.product?.name || 'All'}</TableCell>
                <TableCell className="text-right space-x-2">
                  {onSetReferral && !voucher.is_referral && (
                    <Button
                      variant="ghost" size="icon"
                      title="Set as Referral"
                      onClick={() => onSetReferral(voucher.id)}
                      className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 h-8 w-8"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  )}
                  {onSetReferrerReward && !voucher.is_referrer_reward && (
                    <Button
                      variant="ghost" size="icon"
                      title="Set as Referrer Reward"
                      onClick={() => onSetReferrerReward(voucher.id)}
                      className="text-violet-600 hover:text-violet-800 hover:bg-violet-50 h-8 w-8"
                    >
                      <Gift className="h-4 w-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost" size="icon"
                      title="Edit"
                      onClick={() => onEdit(voucher)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost" size="icon"
                      title="Delete"
                      onClick={() => onDelete(voucher.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
            {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} vouchers
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
