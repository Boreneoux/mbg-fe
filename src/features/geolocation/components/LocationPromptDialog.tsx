'use client';

import { MapPin, Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useLocationStore from '@/stores/useLocationStore';
import { useNearestStore } from '@/features/geolocation/hooks/useNearestStore';

export default function LocationPromptDialog() {
  const status = useLocationStore((s) => s.status);
  const outOfRangeMessage = useLocationStore((s) => s.outOfRangeMessage);
  const openLocationDialog = useLocationStore((s) => s.openLocationDialog);
  const { promptLocation, skipLocation } = useNearestStore();

  const isLocating = status === 'locating';
  const isOutOfRange = status === 'out_of_range';
  const isOpen = status === 'prompting' || isLocating || isOutOfRange;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Don't call skipLocation when dialog closes due to out_of_range —
        // that would overwrite the state with denied + fallback store.
        if (!open && !isLocating && !isOutOfRange) skipLocation();
      }}
    >
      <DialogContent showCloseButton={!isLocating}>
        <div className="flex justify-center mb-2">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
            isOutOfRange ? 'bg-destructive/10' : 'bg-primary/10'
          }`}>
            {isLocating ? (
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            ) : isOutOfRange ? (
              <AlertTriangle className="w-7 h-7 text-destructive" />
            ) : (
              <MapPin className="w-7 h-7 text-primary" />
            )}
          </div>
        </div>

        <DialogHeader>
          <DialogTitle>
            {isLocating
              ? 'Mencari toko terdekat…'
              : isOutOfRange
                ? 'Layanan tidak tersedia'
                : 'Temukan Toko Terdekat'}
          </DialogTitle>
          <DialogDescription>
            {isLocating
              ? 'Sedang memproses lokasi Anda, mohon tunggu sebentar.'
              : isOutOfRange
                ? (outOfRangeMessage ?? 'Tidak ada toko yang dapat melayani lokasi ini.')
                : 'Izinkan akses lokasi agar kami bisa menampilkan produk segar dari toko yang paling dekat dengan Anda.'}
          </DialogDescription>
        </DialogHeader>

        {isOutOfRange && (
          <p className="text-sm text-muted-foreground text-center -mt-1">
            Coba gunakan alamat lain yang lebih dekat dengan toko kami.
          </p>
        )}

        {!isLocating && (
          <DialogFooter>
            {isOutOfRange ? (
              <>
                <Button className="w-full gap-2" onClick={openLocationDialog}>
                  <MapPin className="w-4 h-4" />
                  Coba Lokasi Lain
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={skipLocation}
                >
                  Tutup
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full gap-2" onClick={promptLocation}>
                  <MapPin className="w-4 h-4" />
                  Izinkan Lokasi
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={skipLocation}
                >
                  Lewati
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
