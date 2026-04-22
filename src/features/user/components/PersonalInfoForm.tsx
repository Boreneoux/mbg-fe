'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
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

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
      phone: profile.phone ?? '',
      email: profile.email,
    },
  });

  useEffect(() => {
    form.reset({
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
      phone: profile.phone ?? '',
      email: profile.email,
    });
  }, [profile, form]);

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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nama Depan <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="cth. Budi" {...field} />
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
                  <FormLabel>Nama Belakang</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. Santoso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="cth. 08123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="kamu@contoh.com" {...field} />
                </FormControl>
                <FormDescription className="flex items-center gap-1 text-xs">
                  <Info className="h-3 w-3" />
                  Mengubah email kamu memerlukan verifikasi ulang.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isDirty}
              className="gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSubmitting ? 'Menyimpan…' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
