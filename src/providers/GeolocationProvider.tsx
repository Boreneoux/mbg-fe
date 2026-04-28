'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import useLocationStore from '@/stores/useLocationStore';
import LocationPromptDialog from '@/features/geolocation/components/LocationPromptDialog';
import { useNearestStore } from '@/features/geolocation/hooks/useNearestStore';

const SKIPPED_PREFIXES = ['/auth', '/admin', '/dashboard', '/setup-password', '/reset-password'];

export default function GeolocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSkipped = SKIPPED_PREFIXES.some((p) => pathname.startsWith(p));

  const hasPrompted = useLocationStore((s) => s.hasPrompted);
  const setStatus = useLocationStore((s) => s.setStatus);
  const clearStore = useLocationStore((s) => s.clearStore);
  const coordinates = useLocationStore((s) => s.coordinates);
  const { resolveNearestStoreSilently } = useNearestStore();

  useEffect(() => {
    if (isSkipped) return;

    if (!hasPrompted) {
      setStatus('prompting');
    } else if (coordinates) {
      // Re-resolve in background on every load — no dialog, no spinner
      resolveNearestStoreSilently(coordinates.lat, coordinates.lng);
    } else {
      // User previously skipped/denied with no coordinates — clear any stale store from localStorage
      clearStore();
      setStatus('denied');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {children}
      {!isSkipped && <LocationPromptDialog />}
    </>
  );
}
