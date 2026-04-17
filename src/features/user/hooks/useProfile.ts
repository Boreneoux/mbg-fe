'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { getProfileApi } from '../api/profile.api';
import { UserProfile } from '../types';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchProfile() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProfileApi();
      setProfile(data);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? 'Gagal memuat profil')
        : 'Gagal memuat profil';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, setProfile, isLoading, error, refetch: fetchProfile };
}
