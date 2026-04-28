'use client';

import { Ticket, CalendarX, CheckCircle2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyIDR } from '@/utils/currency';
import { UserVoucher } from '../types';

type Props = {
  userVoucher: UserVoucher;
};

function formatDiscount(userVoucher: UserVoucher) {
  const { discount_type, discount_value, max_discount_amount } = userVoucher.voucher;
  if (discount_type === 'percentage') {
    const cap = max_discount_amount
      ? ` (maks. ${formatCurrencyIDR(Number(max_discount_amount))})`
      : '';
    return `${discount_value}% off${cap}`;
  }
  return `${formatCurrencyIDR(Number(discount_value))} off`;
}

function formatUsageType(type: string) {
  const map: Record<string, string> = {
    total_purchase: 'Total Belanja',
    product_specific: 'Produk Tertentu',
    shipping: 'Gratis Ongkir',
  };
  return map[type] ?? type;
}

export function VoucherCard({ userVoucher }: Props) {
  const { voucher, is_used, used_at, expired_at: assignedExpiry } = userVoucher;
  const effectiveExpiry = assignedExpiry ?? voucher.expired_at;
  const isExpired = !is_used && new Date(effectiveExpiry) < new Date();

  return (
    <div className={`rounded-lg border bg-card p-4 space-y-3 ${is_used || isExpired ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-semibold text-sm tracking-wide">{voucher.code}</span>
          {voucher.is_referral && (
            <Badge variant="secondary" className="text-xs">Referral</Badge>
          )}
        </div>
        <div className="shrink-0">
          {is_used ? (
            <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Terpakai
            </Badge>
          ) : isExpired ? (
            <Badge variant="outline" className="text-xs text-destructive gap-1">
              <CalendarX className="h-3 w-3" />
              Kadaluarsa
            </Badge>
          ) : (
            <Badge className="text-xs gap-1">
              <Ticket className="h-3 w-3" />
              Tersedia
            </Badge>
          )}
        </div>
      </div>

      {/* Discount detail */}
      <div>
        <p className="font-medium text-sm">{formatDiscount(userVoucher)}</p>
        <p className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
          <Tag className="h-3 w-3" />
          {formatUsageType(voucher.usage_type)}
          {voucher.product && ` · ${voucher.product.name}`}
        </p>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {voucher.min_purchase_amount ? (
          <span>Min. belanja {formatCurrencyIDR(Number(voucher.min_purchase_amount))}</span>
        ) : (
          <span>Tidak ada min. belanja</span>
        )}
        {is_used && used_at ? (
          <span>Dipakai {new Date(used_at).toLocaleDateString('id-ID')}</span>
        ) : (
          <span>Berlaku s/d {new Date(effectiveExpiry).toLocaleDateString('id-ID')}</span>
        )}
      </div>
    </div>
  );
}
