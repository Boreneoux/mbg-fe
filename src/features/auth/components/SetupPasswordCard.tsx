'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useSetupPassword } from '@/features/auth/hooks/useSetupPassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { PasswordStrengthHints } from '@/features/auth/components/PasswordStrengthHints';

type Props = {
  token: string;
};

export function SetupPasswordCard({ token }: Props) {
  const { form, onSubmit } = useSetupPassword(token);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { formState: { errors, isSubmitting } } = form;

  return (
    <div className="flex flex-col items-center w-full max-w-sm px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 text-white">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg">MagerBeliGrocery</span>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Buat password kamu</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Akun kamu hampir siap. Buat password untuk masuk ke MagerBeliGrocery.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {errors.root && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {errors.root.message}
              </div>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 8 karakter"
                        autoComplete="new-password"
                        autoFocus
                        className="pr-10"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <PasswordStrengthHints value={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Ulangi password kamu"
                        autoComplete="new-password"
                        className="pr-10"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Buat password dan masuk'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sudah punya akun? Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
