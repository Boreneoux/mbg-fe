'use client';

import { Voucher } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrencyIDR } from '@/utils/currency';

interface VoucherListProps {
  vouchers: Voucher[];
  isLoading: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (voucher: Voucher) => void;
}

export function VoucherList({ vouchers, isLoading, onDelete, onEdit }: VoucherListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border rounded-lg border-dashed">
        No vouchers found.
      </div>
    );
  }

  return (
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
          {vouchers.map((voucher) => (
            <TableRow key={voucher.id}>
              <TableCell className="font-bold">{voucher.code}</TableCell>
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
                {onEdit && (
                  <button 
                    onClick={() => onEdit(voucher)}
                    className="text-xs text-blue-500 hover:text-blue-700 underline"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={() => onDelete(voucher.id)}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Delete
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
