'use client';

import { useState } from 'react';
import { Eye, EyeOff, ShoppingBasket, Smile } from 'lucide-react';
import { useFormAdminLogin } from '@/features/auth/hooks/useFormAdminLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AdminLoginFormCard() {
  const { form, onSubmit } = useFormAdminLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

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
          Sign in to your MalesBeliGrocery admin portal.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {/* Root / server error */}
          {errors.root && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {errors.root.message}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@malesbeligrocery.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register('email')}
              className={
                errors.email
                  ? 'border-destructive focus-visible:ring-destructive/50'
                  : ''
              }
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register('password')}
                className={`pr-10 ${
                  errors.password
                    ? 'border-destructive focus-visible:ring-destructive/50'
                    : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-semibold"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        MalesBeliGrocery &mdash; Admin Portal &mdash; Authorized access only
      </p>
    </div>
  );
}
