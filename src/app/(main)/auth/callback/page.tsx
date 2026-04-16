'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      router.replace('/');
    } else {
      router.replace('/auth/login?error=oauth_failed');
    }
  }, [router, searchParams]);

  return <p className="text-sm text-gray-500">Authenticating...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p className="text-sm text-gray-500">Loading...</p>}>
      <CallbackHandler />
    </Suspense>
  );
}
