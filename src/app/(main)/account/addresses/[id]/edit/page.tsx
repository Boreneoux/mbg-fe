'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AddressForm } from '@/features/addresses/components/AddressForm';
import { UserAddress } from '@/features/addresses/types';
import { getAddressesApi } from '@/features/addresses/api/address.api';

export default function EditAddressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [address, setAddress]         = useState<UserAddress | null>(null);
  const [existingLabels, setExistingLabels] = useState<string[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [notFound, setNotFound]       = useState(false);

  useEffect(() => {
    getAddressesApi()
      .then(list => {
        const found = list.find(a => a.id === id);
        if (found) {
          setAddress(found);
          // Exclude this address's own label from the uniqueness check
          setExistingLabels(
            list
              .filter(a => a.id !== id)
              .map(a => a.label ?? '')
              .filter(Boolean)
          );
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  function handleSuccess(_saved: UserAddress) {
    router.push('/account/addresses');
  }

  return (
    <div className="space-y-5">
      <Link
        href="/account/addresses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Kembali ke Alamat Saya
      </Link>

      <section className="rounded-2xl bg-white border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <h1 className="text-base font-semibold">Edit Alamat</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Perbarui detail alamat pengiriman
          </p>
        </div>
        <div className="px-6 py-6">
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          )}
          {!isLoading && notFound && (
            <p className="text-sm text-muted-foreground">Alamat tidak ditemukan.</p>
          )}
          {!isLoading && address && (
            <AddressForm address={address} onSuccess={handleSuccess} existingLabels={existingLabels} />
          )}
        </div>
      </section>
    </div>
  );
}
