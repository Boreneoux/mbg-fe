'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { logoutApi } from '@/features/auth/api/logout.api';
import useAuthStore from '@/stores/useAuthStore';

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  async function logout() {
    setIsLoading(true);
    try {
      await logoutApi();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Logout error:', error.response?.data);
      }
    } finally {
      setUser(null);
      router.push('/');
      setIsLoading(false);
    }
  }

  return { logout, isLoading };
}
