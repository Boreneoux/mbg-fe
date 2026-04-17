'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePasswordSchema, ChangePasswordValues } from '../schemas/profile.schema';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

export function ChangePasswordForm() {
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const { updateProfile, isSubmitting } = useUpdateProfile(undefined, 'Password berhasil diubah');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values: ChangePasswordValues) {
    try {
      await updateProfile({
        current_password: values.current_password,
        new_password: values.new_password,
      });
      reset();
    } catch {
      // error already toasted in hook
    }
  }

  function toggle(field: keyof typeof show) {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Password lama */}
      <div className="space-y-1.5">
        <Label htmlFor="current_password" className="text-sm font-medium">
          Password Lama <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id="current_password"
            type={show.current ? 'text' : 'password'}
            placeholder="Masukkan password lama"
            aria-invalid={!!errors.current_password}
            {...register('current_password')}
            className={errors.current_password ? 'border-destructive focus-visible:ring-destructive/50 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => toggle('current')}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
          >
            {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.current_password && (
          <p className="text-xs text-destructive">{errors.current_password.message}</p>
        )}
      </div>

      {/* Password baru */}
      <div className="space-y-1.5">
        <Label htmlFor="new_password" className="text-sm font-medium">
          Password Baru <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id="new_password"
            type={show.next ? 'text' : 'password'}
            placeholder="Min 8 karakter, huruf besar, huruf kecil, angka"
            aria-invalid={!!errors.new_password}
            {...register('new_password')}
            className={errors.new_password ? 'border-destructive focus-visible:ring-destructive/50 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => toggle('next')}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
          >
            {show.next ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.new_password && (
          <p className="text-xs text-destructive">{errors.new_password.message}</p>
        )}
      </div>

      {/* Konfirmasi password baru */}
      <div className="space-y-1.5">
        <Label htmlFor="confirm_password" className="text-sm font-medium">
          Konfirmasi Password Baru <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirm_password"
            type={show.confirm ? 'text' : 'password'}
            placeholder="Ulangi password baru"
            aria-invalid={!!errors.confirm_password}
            {...register('confirm_password')}
            className={errors.confirm_password ? 'border-destructive focus-visible:ring-destructive/50 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => toggle('confirm')}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
          >
            {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirm_password && (
          <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          {isSubmitting ? 'Mengubah…' : 'Ubah Password'}
        </Button>
      </div>
    </form>
  );
}
