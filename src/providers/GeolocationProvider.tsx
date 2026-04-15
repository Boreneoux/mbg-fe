'use client';

import { useEffect } from 'react';
import useLocationStore from '@/stores/useLocationStore';
import LocationPromptDialog from '@/features/geolocation/components/LocationPromptDialog';

export default function GeolocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasPrompted = useLocationStore((s) => s.hasPrompted);
  const setStatus = useLocationStore((s) => s.setStatus);

  useEffect(() => {
    // Runs after hydration — localStorage values are available here
    if (!hasPrompted) {
      setStatus('prompting');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {children}
      <LocationPromptDialog />
    </>
  );
}
