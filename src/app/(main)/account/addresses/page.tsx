'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddresses } from '@/features/addresses/hooks/useAddresses';
import { AddressCard } from '@/features/addresses/components/AddressCard';

export default function AddressesPage() {
  const router = useRouter();
  const { addresses, isLoading, error, deleteAddress, setPrimary } = useAddresses();

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-white border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Alamat Saya</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kelola alamat pengiriman kamu
            </p>
          </div>
          <Button asChild size="sm" className="gap-2">
            <Link href="/account/addresses/new">
              <Plus className="h-4 w-4" />
              Tambah Alamat
            </Link>
          </Button>
        </div>

        <div className="px-6 py-6">
          {/* Loading */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2].map(i => <Skeleton key={i} className="h-36 w-full rounded-lg" />)}
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && addresses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium">Belum ada alamat tersimpan</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Tambahkan alamat pengiriman kamu
              </p>
              <Button asChild size="sm" className="gap-2">
                <Link href="/account/addresses/new">
                  <Plus className="h-4 w-4" />
                  Tambah Alamat
                </Link>
              </Button>
            </div>
          )}

          {/* Address list */}
          {!isLoading && addresses.length > 0 && (
            <div className="space-y-3">
              {addresses.map(address => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={a => router.push(`/account/addresses/${a.id}/edit`)}
                  onDelete={deleteAddress}
                  onSetPrimary={setPrimary}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
