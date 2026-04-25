'use client';

import { Discount } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrencyIDR } from '@/utils/currency';

interface DiscountListProps {
  discounts: Discount[];
  isLoading: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (discount: Discount) => void;
  onToggleActive?: (id: number, currentStatus: boolean) => void;
}

export function DiscountList({ discounts, isLoading, onDelete, onEdit, onToggleActive }: DiscountListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (discounts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border rounded-lg border-dashed">
        No discounts found.
      </div>
    );
  }

  return (
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
          {discounts.map((discount) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
