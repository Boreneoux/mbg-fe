'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, MailCheck, ShoppingCart } from 'lucide-react';
import { useFormForgotPassword } from '@/features/auth/hooks/useFormForgotPassword';
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

export function ForgotPasswordCard() {
  const { form, onSubmit, successMessage } = useFormForgotPassword();
  const { getValues, formState: { errors, isSubmitting } } = form;

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
        {successMessage ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <MailCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Email terkirim!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              Link reset password telah dikirim ke
            </p>
            <p className="text-sm font-semibold text-foreground mb-6">
              {getValues('email')}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-8">
              Cek inbox atau folder spam kamu. Link berlaku selama 1 jam.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke halaman masuk
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className="flex flex-col items-center text-center mb-7">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Lupa password?</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Masukkan email kamu dan kami akan mengirim link untuk reset password.
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contoh@email.com"
                          autoComplete="email"
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim link reset password'}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke halaman masuk
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
