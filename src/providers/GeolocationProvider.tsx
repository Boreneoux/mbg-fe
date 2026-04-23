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
  const coordinates = useLocationStore((s) => s.coordinates);
  const { resolveNearestStoreSilently } = useNearestStore();

  useEffect(() => {
    if (isSkipped) return;

    if (!hasPrompted) {
      setStatus('prompting');
    } else if (coordinates) {
      // Re-resolve in background on every load — no dialog, no spinner
      resolveNearestStoreSilently(coordinates.lat, coordinates.lng);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {children}
      {!isSkipped && <LocationPromptDialog />}
    </>
  );
}
