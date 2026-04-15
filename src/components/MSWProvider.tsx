'use client';

import { useEffect, useState } from 'react';

/**
 * Initialises MSW in the browser during development.
 * In production (or when NEXT_PUBLIC_ENABLE_MSW is unset) this is a no-op passthrough.
 *
 * Wrap the root layout with this component so the service worker is registered
 * before any API calls fire.
 */
export default function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(
    process.env.NEXT_PUBLIC_ENABLE_MSW !== 'true',
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_MSW !== 'true') return;

    import('@/mocks/browser').then(({ worker }) => {
      worker
        .start({
          onUnhandledRequest: 'warn', // log unmatched requests instead of forwarding to real network
          serviceWorker: {
            url: '/mockServiceWorker.js',
          },
        })
        .then(() => setMswReady(true));
    });
  }, []);

  if (!mswReady) return null;

  return <>{children}</>;
}
