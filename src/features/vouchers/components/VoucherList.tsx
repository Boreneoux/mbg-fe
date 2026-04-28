'use client';

import { Voucher } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyIDR } from '@/utils/currency';

interface VoucherListProps {
  vouchers: Voucher[];
  isLoading: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (voucher: Voucher) => void;
  onSetReferral?: (id: number) => void;
  onSetReferrerReward?: (id: number) => void;
}

export function VoucherList({ vouchers, isLoading, onDelete, onEdit, onSetReferral, onSetReferrerReward }: VoucherListProps) {
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
                  <button
                    onClick={() => onSetReferral(voucher.id)}
                    className="text-xs text-emerald-600 hover:text-emerald-800 underline"
                  >
                    Set as Referral
                  </button>
                )}
                {onSetReferrerReward && !voucher.is_referrer_reward && (
                  <button
                    onClick={() => onSetReferrerReward(voucher.id)}
                    className="text-xs text-violet-600 hover:text-violet-800 underline"
                  >
                    Set as Referrer Reward
                  </button>
                )}
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
