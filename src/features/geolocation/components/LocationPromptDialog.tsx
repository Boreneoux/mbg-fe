'use client';

import { MapPin, Loader2 } from 'lucide-react';
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
  const { promptLocation, skipLocation } = useNearestStore();

  const isOpen = status === 'prompting' || status === 'locating';
  const isLocating = status === 'locating';

  return (
    <Dialog
      open={isOpen}
      // Prevent closing while actively locating; allow ESC / overlay click otherwise
      onOpenChange={(open) => {
        if (!open && !isLocating) skipLocation();
      }}
    >
      <DialogContent showCloseButton={!isLocating}>
        {/* Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            {isLocating ? (
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            ) : (
              <MapPin className="w-7 h-7 text-primary" />
            )}
          </div>
        </div>

        <DialogHeader>
          <DialogTitle>
            {isLocating ? 'Mencari toko terdekat…' : 'Temukan Toko Terdekat'}
          </DialogTitle>
          <DialogDescription>
            {isLocating
              ? 'Sedang memproses lokasi Anda, mohon tunggu sebentar.'
              : 'Izinkan akses lokasi agar kami bisa menampilkan produk segar dari toko yang paling dekat dengan Anda.'}
          </DialogDescription>
        </DialogHeader>

        {!isLocating && (
          <DialogFooter>
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
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
