'use client';

import { useState } from 'react';
import { Eye, EyeOff, ShoppingBasket, Smile } from 'lucide-react';
import { useFormAdminLogin } from '@/features/auth/hooks/useFormAdminLogin';
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

export function AdminLoginFormCard() {
  const { form, onSubmit } = useFormAdminLogin();
  const [showPassword, setShowPassword] = useState(false);
  const { formState: { errors, isSubmitting } } = form;

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Brand */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
          <ShoppingBasket className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
          Welcome back, team!
          <Smile className="w-6 h-6 text-primary" />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your MagerBeliGrocery admin portal.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {errors.root && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
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
                      placeholder="you@magerbeligrocery.com"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="pr-10"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Form>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        MagerBeliGrocery &mdash; Admin Portal &mdash; Authorized access only
      </p>
    </div>
  );
}
