'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import { MapPin, LocateFixed, CheckCircle2, Plus, Loader2, AlertTriangle } from 'lucide-react';
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
import { getAddressesApi } from '../api/address.api';
import { UserAddress } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function DeliveryAddressSheet({ open, onClose }: Props) {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState<string | null>(null);
  const [errorAddressId, setErrorAddressId] = useState<string | null>(null);

  const selectedAddressId = useLocationStore((s) => s.selectedAddressId);
  const setSelectedAddressId = useLocationStore((s) => s.setSelectedAddressId);
  const setDisplayLocation = useLocationStore((s) => s.setDisplayLocation);
  const setCoordinates = useLocationStore((s) => s.setCoordinates);
  const setSelectedStore = useLocationStore((s) => s.setSelectedStore);
  const clearStore = useLocationStore((s) => s.clearStore);
  const setStatus = useLocationStore((s) => s.setStatus);
  const setOutOfRangeMessage = useLocationStore((s) => s.setOutOfRangeMessage);

  const { promptLocation } = useNearestStore();

  useEffect(() => {
    if (!open) return;
    setErrorAddressId(null);
    setLoading(true);
    getAddressesApi()
      .then(setAddresses)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [open]);

  async function handleSelectAddress(addr: UserAddress) {
    setResolving(addr.id);
    setErrorAddressId(null);
    const lat = Number(addr.latitude);
    const lng = Number(addr.longitude);
    try {
      setCoordinates({ lat, lng });
      setStatus('locating');
      const result = await getNearestStoreApi(lat, lng);
      setSelectedStore(result.store.id, result.store.name, result.store.slug);
      setOutOfRangeMessage(null);
      setStatus('found');
      setSelectedAddressId(addr.id);
      setDisplayLocation(addr.label ?? addr.city.name);
      onClose();
    } catch (err) {
      const message = isAxiosError(err) && err.response?.status === 404
        ? (err.response.data?.message ?? 'Layanan tidak tersedia di lokasi ini.')
        : 'Gagal memverifikasi lokasi. Coba lagi.';
      clearStore();
      setOutOfRangeMessage(message);
      setStatus('out_of_range');
      setErrorAddressId(addr.id);
    } finally {
      setResolving(null);
    }
  }

  function handleUseGps() {
    setSelectedAddressId(null);
    setErrorAddressId(null);
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
              const hasError = errorAddressId === addr.id;
              return (
                <div key={addr.id} className="mb-2">
                  <button
                    onClick={() => handleSelectAddress(addr)}
                    disabled={resolving !== null}
                    className={`w-full text-left rounded-xl border p-4 transition-colors flex items-start gap-3 disabled:opacity-60 ${
                      hasError
                        ? 'border-destructive/50 bg-destructive/5'
                        : isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isResolving ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : hasError ? (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
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

                  {hasError && (
                    <div className="flex items-start gap-2 mt-1 px-2 text-xs text-destructive">
                      <span>Lokasi ini di luar jangkauan semua toko kami. Coba alamat lain.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="px-5 pb-2">
            <Button variant="outline" size="sm" className="w-full gap-2" asChild>
              <Link href="/account/addresses/new" onClick={onClose}>
                <Plus className="w-4 h-4" />
                Tambah Alamat Baru
              </Link>
            </Button>
          </div>
        </div>

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
