'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, KeyRound, ShoppingCart } from 'lucide-react';
import { useFormResetPassword } from '@/features/auth/hooks/useFormResetPassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  token: string;
};

export function ResetPasswordCard({ token }: Props) {
  const { form, onSubmit } = useFormResetPassword(token);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="flex flex-col items-center w-full max-w-sm px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 text-white">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg">MalesBeliGrocery</span>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <KeyRound className="w-7 h-7 text-slate-700" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Buat password baru</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Password baru kamu harus berbeda dari password yang sebelumnya.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {errors.root && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {errors.root.message}
            </div>
          )}

          {/* New password */}
          <div className="space-y-1.5">
            <Label htmlFor="new_password" className="text-sm font-medium">
              Password baru
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNew ? 'text' : 'password'}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                aria-invalid={!!errors.new_password}
                {...register('new_password')}
                className={`pr-10 ${
                  errors.new_password
                    ? 'border-destructive focus-visible:ring-destructive/50'
                    : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                aria-label={showNew ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-xs text-destructive">{errors.new_password.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm_password" className="text-sm font-medium">
              Konfirmasi password baru
            </Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Ulangi password baru"
                autoComplete="new-password"
                aria-invalid={!!errors.confirm_password}
                {...register('confirm_password')}
                className={`pr-10 ${
                  errors.confirm_password
                    ? 'border-destructive focus-visible:ring-destructive/50'
                    : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan password baru'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
