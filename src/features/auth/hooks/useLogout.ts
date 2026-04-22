'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { logoutApi } from '@/features/auth/api/logout.api';
import useAuthStore from '@/stores/useAuthStore';

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  async function logout() {
    const role = user?.role;
    setIsLoading(true);
    try {
      await logoutApi();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Logout error:', error.response?.data);
      }
    } finally {
      setUser(null);
      toast.success('Kamu berhasil keluar. Sampai jumpa!');
      router.push(role === 'super_admin' || role === 'store_admin' ? '/admin/login' : '/auth/login');
      setIsLoading(false);
    }
  }

  return { logout, isLoading };
}
