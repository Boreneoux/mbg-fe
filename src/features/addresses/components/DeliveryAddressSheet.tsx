'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, LocateFixed, CheckCircle2, Plus, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useLocationStore from '@/stores/useLocationStore';
import { useNearestStore } from '@/features/geolocation/hooks/useNearestStore';
import { getNearestStoreApi } from '@/features/geolocation/api/nearest-store.api';
import { FALLBACK_STORE_ID } from '@/mocks/handlers/stores.handlers';
import { getAddressesApi } from '../api/address.api';
import { UserAddress } from '../types';

const FALLBACK_STORE_NAME = 'MagerBeliGrocery – Sudirman';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function DeliveryAddressSheet({ open, onClose }: Props) {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState<string | null>(null);

  const selectedAddressId = useLocationStore((s) => s.selectedAddressId);
  const setSelectedAddressId = useLocationStore((s) => s.setSelectedAddressId);
  const setDisplayLocation = useLocationStore((s) => s.setDisplayLocation);
  const setCoordinates = useLocationStore((s) => s.setCoordinates);
  const setSelectedStore = useLocationStore((s) => s.setSelectedStore);
  const setStatus = useLocationStore((s) => s.setStatus);

  const { promptLocation } = useNearestStore();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getAddressesApi()
      .then(setAddresses)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [open]);

  async function handleSelectAddress(addr: UserAddress) {
    setResolving(addr.id);
    // Prisma Decimal fields serialize as strings in JSON — coerce to number explicitly
    const lat = Number(addr.latitude);
    const lng = Number(addr.longitude);
    try {
      setCoordinates({ lat, lng });
      setStatus('locating');
      try {
        const result = await getNearestStoreApi(lat, lng);
        setSelectedStore(result.store.id, result.store.name);
        setStatus('found');
      } catch {
        setSelectedStore(FALLBACK_STORE_ID, FALLBACK_STORE_NAME);
        setStatus('out_of_range');
      }
      // Set label AFTER store resolution — no geocoding so nothing overwrites it
      setSelectedAddressId(addr.id);
      setDisplayLocation(addr.label ?? addr.city.name);
      onClose();
    } finally {
      setResolving(null);
    }
  }

  function handleUseGps() {
    setSelectedAddressId(null);
    promptLocation();
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
          <SheetTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-4 h-4 text-primary" />
            Kirim ke mana?
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Saved addresses */}
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Alamat Tersimpan
            </p>

            {loading && (
              <div className="space-y-3">
                {[1, 2].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            )}

            {!loading && addresses.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">
                Belum ada alamat tersimpan.
              </p>
            )}

            {!loading && addresses.map(addr => {
              const isSelected = addr.id === selectedAddressId;
              const isResolving = resolving === addr.id;
              return (
                <button
                  key={addr.id}
                  onClick={() => handleSelectAddress(addr)}
                  disabled={resolving !== null}
                  className={`w-full text-left rounded-xl border p-4 mb-2 transition-colors flex items-start gap-3 disabled:opacity-60 ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isResolving ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : (
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">
                        {addr.label ?? 'Alamat'}
                      </span>
                      {addr.is_primary && (
                        <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                          Utama
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {addr.address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {[addr.district.name, addr.city.name].join(', ')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Add address link */}
          <div className="px-5 pb-2">
            <Button variant="outline" size="sm" className="w-full gap-2" asChild>
              <Link href="/account/addresses/new" onClick={onClose}>
                <Plus className="w-4 h-4" />
                Tambah Alamat Baru
              </Link>
            </Button>
          </div>
        </div>

        {/* GPS option pinned at bottom */}
        <div className="shrink-0 border-t border-border px-5 py-4">
          <button
            onClick={handleUseGps}
            className="w-full flex items-center gap-3 rounded-xl border border-border px-4 py-3 hover:border-primary/50 hover:bg-secondary/50 transition-colors text-left"
          >
            <LocateFixed className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Gunakan Lokasi GPS</p>
              <p className="text-xs text-muted-foreground">Deteksi lokasi saya saat ini</p>
            </div>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
