'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
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
import { changePasswordSchema, ChangePasswordValues } from '../schemas/profile.schema';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

export function ChangePasswordForm() {
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const { updateProfile, isSubmitting } = useUpdateProfile(undefined, 'Password berhasil diubah');

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values: ChangePasswordValues) {
    try {
      await updateProfile({
        current_password: values.current_password,
        new_password: values.new_password,
      });
      form.reset();
    } catch {
      // error already toasted in hook
    }
  }

  function toggle(field: keyof typeof show) {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password Lama <span className="text-destructive">*</span>
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={show.current ? 'text' : 'password'}
                    placeholder="Masukkan password lama"
                    className="pr-10"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => toggle('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password Baru <span className="text-destructive">*</span>
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={show.next ? 'text' : 'password'}
                    placeholder="Min 8 karakter, huruf besar, huruf kecil, angka"
                    className="pr-10"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => toggle('next')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  {show.next ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Konfirmasi Password Baru <span className="text-destructive">*</span>
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={show.confirm ? 'text' : 'password'}
                    placeholder="Ulangi password baru"
                    className="pr-10"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => toggle('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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
    </Form>
  );
}
