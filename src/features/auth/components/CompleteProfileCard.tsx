'use client';

import { ShoppingCart } from 'lucide-react';
import { useCompleteProfile } from '@/features/auth/hooks/useCompleteProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CompleteProfileCard() {
  const { form, onSubmit } = useCompleteProfile();
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

      {/* Card */}
      <div className="w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-foreground mb-1">Lengkapi profil kamu</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Satu langkah lagi sebelum kamu bisa mulai belanja.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {errors.root && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {errors.root.message}
            </div>
          )}

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-medium">
              Nomor telepon
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="08123456789"
              autoComplete="tel"
              autoFocus
              aria-invalid={!!errors.phone}
              {...register('phone')}
              className={
                errors.phone
                  ? 'border-destructive focus-visible:ring-destructive/50'
                  : ''
              }
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Referral code (optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="referral_code" className="text-sm font-medium">
              Kode referral{' '}
              <span className="font-normal text-muted-foreground">(opsional)</span>
            </Label>
            <Input
              id="referral_code"
              type="text"
              placeholder="Masukkan kode referral"
              autoComplete="off"
              {...register('referral_code')}
            />
          </div>

          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan dan lanjutkan'}
          </Button>
        </form>
      </div>
    </div>
  );
}
