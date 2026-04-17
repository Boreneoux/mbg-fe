'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { updateProfileApi, resendVerificationApi } from '../api/profile.api';
import { UserProfile } from '../types';
import { PersonalInfoValues, ChangePasswordValues } from '../schemas/profile.schema';
import useAuthStore from '@/stores/useAuthStore';

type UpdatePayload = Partial<PersonalInfoValues> & Partial<ChangePasswordValues> & { photo?: File };

export function useUpdateProfile(
  onSuccess?: (updated: UserProfile) => void,
  successMessage = 'Profil berhasil diperbarui',
) {
  const { setUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function updateProfile(payload: UpdatePayload) {
    setIsSubmitting(true);
    try {
      const updated = await updateProfileApi(payload);
      setUser({
        id: updated.id,
        email: updated.email,
        first_name: updated.first_name,
        last_name: updated.last_name,
        role: updated.role,
        is_verified: updated.is_verified,
        profile_image: updated.profile_image,
        referral_code: updated.referral_code,
      });
      toast.success(successMessage);
      onSuccess?.(updated);
      return updated;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? 'Gagal memperbarui profil')
        : 'Gagal memperbarui profil';
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { updateProfile, isSubmitting };
}

export function useResendVerification() {
  const [isSending, setIsSending] = useState(false);

  async function resend(email: string) {
    setIsSending(true);
    try {
      await resendVerificationApi(email);
      toast.success('Email verifikasi terkirim! Cek inbox kamu.');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? 'Gagal mengirim email verifikasi')
        : 'Gagal mengirim email verifikasi';
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  }

  return { resend, isSending };
}
