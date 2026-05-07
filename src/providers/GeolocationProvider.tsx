'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import useLocationStore from '@/stores/useLocationStore';
import LocationPromptDialog from '@/features/geolocation/components/LocationPromptDialog';
import { useNearestStore } from '@/features/geolocation/hooks/useNearestStore';

const SKIPPED_PREFIXES = [
  '/auth',
  '/admin',
  '/dashboard',
  '/setup-password',
  '/reset-password'
];

export default function GeolocationProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSkipped = SKIPPED_PREFIXES.some(p => pathname.startsWith(p));

  const hasPrompted = useLocationStore(s => s.hasPrompted);
  const setStatus = useLocationStore(s => s.setStatus);
  const clearStore = useLocationStore(s => s.clearStore);
  const coordinates = useLocationStore(s => s.coordinates);
  const { resolveWithFreshGPS } = useNearestStore();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useLocationStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    if (useLocationStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated || isSkipped) return;

    if (!hasPrompted) {
      setStatus('prompting');
    } else if (coordinates) {
      // Re-resolve with fresh GPS on every load — updates coords if user moved
      resolveWithFreshGPS();
    } else {
      // User previously skipped/denied with no coordinates — clear any stale store from localStorage
      clearStore();
      setStatus('denied');
    }
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {children}
      {!isSkipped && <LocationPromptDialog />}
    </>
  );
}
