'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { sessionApi } from '@/features/auth/api/session.api';
import useAuthStore from '@/stores/useAuthStore';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    const status = searchParams.get('status');
    if (status !== 'success') {
      router.replace('/auth/login?error=oauth_failed');
      return;
    }

    sessionApi().then((user) => {
      if (cancelled) return;
      setUser(user);
      if (user) {
        toast.success(`Selamat datang, ${user.first_name ?? user.email}!`);
        router.replace(user.role === 'user' ? '/' : '/dashboard');
      } else {
        router.replace('/auth/login?error=oauth_failed');
      }
    });

    return () => { cancelled = true; };
  }, [router, searchParams, setUser]);

  return <p className="text-sm text-gray-500">Authenticating...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p className="text-sm text-gray-500">Loading...</p>}>
      <CallbackHandler />
    </Suspense>
  );
}
