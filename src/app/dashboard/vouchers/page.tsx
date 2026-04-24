'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVouchers } from '@/features/vouchers/hooks/useVouchers';

export default function VouchersPage() {
  const { vouchers, isLoading, error, refetch } = useVouchers({ limit: 50 });

  const formatVoucherKind = useMemo(() => {
    return (type: string) => {
      switch (type) {
        case 'product_specific':
          return 'Product voucher';
        case 'total_purchase':
          return 'Total purchase';
        case 'shipping':
          return 'Shipping';
        default:
          return type;
      }
    };
  }, []);

  const formatDiscountType = useMemo(() => {
    return (type: string) => {
      return type === 'percentage' ? 'Percentage' : 'Nominal';
    };
  }, []);

  const formatCurrency = (value?: number | null) =>
    value == null
      ? '-'
      : new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vouchers</h1>
          <p className="text-gray-600 mt-1">Browse voucher codes, usage rules, and expiry information.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? [...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent>
                  <div className="h-24 rounded-lg bg-muted" />
                </CardContent>
              </Card>
            ))
          : vouchers.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No vouchers are available right now.
            </div>
          ) : (
            vouchers.map((voucher) => (
              <Card key={voucher.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>{voucher.code}</CardTitle>
                      <CardDescription>{formatVoucherKind(voucher.usage_type)}</CardDescription>
                    </div>
                    <Badge variant="secondary">{formatDiscountType(voucher.discount_type)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{voucher.discount_value}%</Badge>
                    {voucher.max_discount_amount != null ? (
                      <Badge variant="outline">Max {formatCurrency(voucher.max_discount_amount)}</Badge>
                    ) : null}
                    {voucher.min_purchase_amount != null ? (
                      <Badge variant="outline">Min {formatCurrency(voucher.min_purchase_amount)}</Badge>
                    ) : null}
                  </div>
                  <div className="grid gap-3 text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em]">Expiry</p>
                      <p>{new Date(voucher.expired_at).toLocaleDateString()}</p>
                    </div>
                    {voucher.product ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em]">Product</p>
                        <p>{voucher.product.name}</p>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
      </div>
    </div>
  );
}
