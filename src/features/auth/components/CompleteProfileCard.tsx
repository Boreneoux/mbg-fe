'use client';

import { ShoppingCart } from 'lucide-react';
import { useCompleteProfile } from '@/features/auth/hooks/useCompleteProfile';
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

export function CompleteProfileCard() {
  const { form, onSubmit } = useCompleteProfile();
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

      {/* Card */}
      <div className="w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-foreground mb-1">Lengkapi profil kamu</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Satu langkah lagi sebelum kamu bisa mulai belanja.
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor telepon</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="08123456789"
                      autoComplete="tel"
                      autoFocus
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

            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan dan lanjutkan'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
