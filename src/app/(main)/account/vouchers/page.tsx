'use client';

import Link from 'next/link';
import { Ticket } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useUserVouchers } from '@/features/vouchers/hooks/useUserVouchers';
import { VoucherCard } from '@/features/vouchers/components/VoucherCard';

export default function VouchersPage() {
  const { userVouchers, isLoading, error } = useUserVouchers();

  const now = new Date();
  const effectiveExpiry = (uv: typeof userVouchers[number]) =>
    new Date(uv.expired_at ?? uv.voucher.expired_at);

  const available = userVouchers.filter(
    (uv) => !uv.is_used && effectiveExpiry(uv) >= now,
  );
  const used = userVouchers.filter((uv) => uv.is_used);
  const expired = userVouchers.filter(
    (uv) => !uv.is_used && effectiveExpiry(uv) < now,
  );

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-white border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <h1 className="text-base font-semibold">Voucher Saya</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Voucher yang bisa kamu gunakan saat checkout
          </p>
        </div>

        <div className="px-6 py-6">
          {/* Loading */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg" />
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && userVouchers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Ticket className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium">Belum ada voucher</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Yuk, mulai belanja dan dapatkan penawaran terbaik
              </p>
              <Button asChild size="sm">
                <Link href="/products">Mulai Belanja</Link>
              </Button>
            </div>
          )}

          {/* Available vouchers */}
          {!isLoading && available.length > 0 && (
            <div className="space-y-3">
              {available.map((uv) => (
                <VoucherCard key={uv.id} userVoucher={uv} />
              ))}
            </div>
          )}

          {/* Used & expired vouchers */}
          {!isLoading && (used.length > 0 || expired.length > 0) && (
            <div className="mt-6 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Riwayat
              </p>
              {[...used, ...expired].map((uv) => (
                <VoucherCard key={uv.id} userVoucher={uv} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
