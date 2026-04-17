'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { personalInfoSchema, PersonalInfoValues } from '../schemas/profile.schema';
import { UserProfile } from '../types';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { EmailVerificationBanner } from './EmailVerificationBanner';

interface Props {
  profile: UserProfile;
  onUpdated: (updated: UserProfile) => void;
}

export function PersonalInfoForm({ profile, onUpdated }: Props) {
  const [emailChanged, setEmailChanged] = useState(false);
  const { updateProfile, isSubmitting } = useUpdateProfile((updated) => {
    if (updated.email !== profile.email) setEmailChanged(true);
    onUpdated(updated);
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
      phone: profile.phone ?? '',
      email: profile.email,
    },
  });

  useEffect(() => {
    reset({
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
      phone: profile.phone ?? '',
      email: profile.email,
    });
  }, [profile, reset]);

  async function onSubmit(values: PersonalInfoValues) {
    try {
      await updateProfile(values);
    } catch {
      // error already toasted in hook
    }
  }

  return (
    <div className="space-y-5">
      {(!profile.is_verified || emailChanged) && (
        <EmailVerificationBanner email={profile.email} isEmailChanged={emailChanged} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="first_name" className="text-sm font-medium">
              Nama Depan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="first_name"
              placeholder="cth. Budi"
              aria-invalid={!!errors.first_name}
              {...register('first_name')}
              className={errors.first_name ? 'border-destructive focus-visible:ring-destructive/50' : ''}
            />
            {errors.first_name && (
              <p className="text-xs text-destructive">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="last_name" className="text-sm font-medium">
              Nama Belakang
            </Label>
            <Input
              id="last_name"
              placeholder="cth. Santoso"
              {...register('last_name')}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium">
            Nomor Telepon
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="cth. 08123456789"
            aria-invalid={!!errors.phone}
            {...register('phone')}
            className={errors.phone ? 'border-destructive focus-visible:ring-destructive/50' : ''}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="kamu@contoh.com"
            aria-invalid={!!errors.email}
            {...register('email')}
            className={errors.email ? 'border-destructive focus-visible:ring-destructive/50' : ''}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              Mengubah email kamu memerlukan verifikasi ulang.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !isDirty} className="gap-2">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSubmitting ? 'Menyimpan…' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
}
