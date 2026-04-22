'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBasket, LogOut, Menu } from 'lucide-react';
import useAuthStore from '@/stores/useAuthStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import SuperAdminMenu from './SuperAdminMenu';
import StoreAdminMenu from './StoreAdminMenu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function getInitials(firstName: string | null, lastName: string | null, email: string) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  return email[0].toUpperCase();
}

function getRoleLabel(role: string) {
  if (role === 'super_admin') return 'Super Admin';
  if (role === 'store_admin') return 'Store Admin';
  return role;
}

function SidebarContent() {
  const user = useAuthStore((s) => s.user);
  const { logout, isLoading } = useLogout();

  if (!user) return null;

  const initials = getInitials(user.first_name, user.last_name, user.email);
  const displayName = user.first_name
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`
    : user.email;

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="border-b border-border px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <ShoppingBasket className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">MagerBeliGrocery</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {user.role === 'super_admin' && <SuperAdminMenu />}
        {user.role === 'store_admin' && <StoreAdminMenu />}
      </div>

      {/* User footer */}
      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user.profile_image ?? undefined} alt={displayName} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{getRoleLabel(user.role)}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={logout}
          disabled={isLoading}
        >
          <LogOut className="h-4 w-4" />
          {isLoading ? 'Signing out…' : 'Sign out'}
        </Button>
      </div>
    </div>
  );
}

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: hamburger + Sheet */}
      <div className="flex items-center border-b border-border px-4 py-3 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="ml-3 flex items-center gap-2">
          <ShoppingBasket className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold">MagerBeliGrocery</span>
        </Link>
      </div>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen border-r border-border bg-white">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
