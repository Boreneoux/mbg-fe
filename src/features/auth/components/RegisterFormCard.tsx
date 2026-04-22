'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useFormRegister } from '@/features/auth/hooks/useFormRegister';
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

export function RegisterFormCard() {
  const { form, onSubmit } = useFormRegister();
  const { formState: { errors, isSubmitting } } = form;

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2 mb-7 text-white">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg">MagerBeliGrocery</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm lg:max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-foreground mb-1">Buat akun baru</h1>
          <p className="text-sm text-muted-foreground">
            Daftar gratis dan mulai belanja sekarang.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {errors.root && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {errors.root.message}
              </div>
            )}

            {/* First name + Last name */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama depan</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Budi"
                        autoComplete="given-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama belakang</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Santoso"
                        autoComplete="family-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contoh@email.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor telepon</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="08123456789"
                      autoComplete="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referral_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Kode referral{' '}
                    <span className="font-normal text-muted-foreground">(opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Masukkan kode referral"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-xs text-muted-foreground">
              Link verifikasi akan dikirim ke email kamu untuk mengaktifkan akun.
            </p>

            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mendaftarkan akun...' : 'Daftar sekarang'}
            </Button>
          </form>
        </Form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-muted-foreground">atau daftar dengan</span>
          </div>
        </div>

        {/* Google OAuth */}
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Lanjutkan dengan Google
        </a>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-primary hover:underline underline-offset-2"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
