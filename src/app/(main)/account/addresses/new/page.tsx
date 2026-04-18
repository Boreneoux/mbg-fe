'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { AddressForm } from '@/features/addresses/components/AddressForm';
import { UserAddress } from '@/features/addresses/types';
import { getAddressesApi } from '@/features/addresses/api/address.api';

export default function NewAddressPage() {
  const router = useRouter();
  const [existingLabels, setExistingLabels] = useState<string[]>([]);

  useEffect(() => {
    getAddressesApi()
      .then(list => setExistingLabels(list.map(a => a.label ?? '').filter(Boolean)))
      .catch(() => null);
  }, []);

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
          <h1 className="text-base font-semibold">Tambah Alamat Baru</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Isi detail alamat pengiriman kamu
          </p>
        </div>
        <div className="px-6 py-6">
          <AddressForm onSuccess={handleSuccess} existingLabels={existingLabels} />
        </div>
      </section>
    </div>
  );
}
