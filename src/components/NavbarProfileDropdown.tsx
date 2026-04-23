'use client';

import Link from 'next/link';
import { User, ShoppingBag, LogOut } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import type { AuthUser } from '@/features/auth/types';

interface NavbarProfileDropdownProps {
  user: AuthUser;
  onLogout: () => void;
  isLoggingOut: boolean;
}

function getInitials(user: AuthUser): string {
  if (user.first_name) {
    const last = user.last_name?.[0] ?? '';
    return (user.first_name[0] + last).toUpperCase();
  }
  return user.email[0].toUpperCase();
}

export function NavbarProfileDropdown({
  user,
  onLogout,
  isLoggingOut
}: NavbarProfileDropdownProps) {
  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email;

  return (
    <HoverCard openDelay={100} closeDelay={150}>
      <HoverCardTrigger asChild>
        <Link
          href="/account/profile"
          className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt={displayName}
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
          ) : (
            <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(user)}
            </span>
          )}
          <span className="hidden lg:inline max-w-28 truncate">
            {displayName}
          </span>
        </Link>
      </HoverCardTrigger>

      <HoverCardContent align="center" className="w-56 p-0 shadow-lg">
        {/* User info header */}
        <div className="px-4 py-3 bg-secondary/40">
          <p className="text-xs text-muted-foreground">Masuk sebagai</p>
          <p className="text-sm font-semibold truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>

        <Separator />

        {/* Links */}
        <div className="py-1">
          <Link
            href="/account/orders"
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
            Pesanan Saya
          </Link>
          <Link
            href="/account/profile"
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
            <User className="w-4 h-4 text-muted-foreground" />
            Profil Saya
          </Link>
        </div>

        <Separator />

        {/* Sign out */}
        <div className="py-1">
          <button
            onClick={onLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 cursor-pointer">
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
