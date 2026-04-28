'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, MapPin, ShoppingBag, Ticket } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';

const NAV_ITEMS = [
  { href: '/account/profile', label: 'Profil Saya', icon: User },
  { href: '/account/addresses', label: 'Alamat Saya', icon: MapPin },
  { href: '/account/orders', label: 'Pesanan Saya', icon: ShoppingBag },
  { href: '/account/vouchers', label: 'Voucher Saya', icon: Ticket },
];

function getInitials(firstName?: string | null, lastName?: string | null, email?: string) {
  const first = firstName?.[0] ?? '';
  const last = lastName?.[0] ?? '';
  return (first + last).toUpperCase() || (email?.[0]?.toUpperCase() ?? '?');
}

export function AccountSidebarNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const displayName =
    user ? [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email : '';

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-border overflow-hidden">
      {/* User identity */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={user?.profile_image ?? undefined} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {getInitials(user?.first_name, user?.last_name, user?.email)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col py-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative',
                active
                  ? 'text-primary font-medium bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60',
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 inset-y-0 w-0.5 rounded-r-full bg-primary" />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
