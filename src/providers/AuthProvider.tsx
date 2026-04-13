'use client';

import { useEffect } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import { sessionApi } from '@/features/auth/api/session.api';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const bootstrap = async () => {
      const user = await sessionApi();
      setUser(user);
    };

    bootstrap();
  }, [setUser]);

  return <>{children}</>;
}
