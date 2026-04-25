'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  Package,
  Tag,
  Ticket,
  Users,
  Warehouse,
  ArrowLeftRight,
  ShoppingBag,
  Percent,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Stores', href: '/dashboard/stores', icon: Store },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Categories', href: '/dashboard/categories', icon: Tag },
  { label: 'Vouchers', href: '/dashboard/vouchers', icon: Ticket },
  { label: 'Discounts', href: '/dashboard/discounts', icon: Percent },
  { label: 'Users', href: '/dashboard/users', icon: Users },
  { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'Inventory', href: '/dashboard/inventory', icon: Warehouse },
  { label: 'Stock Mutations', href: '/dashboard/stock-mutations', icon: ArrowLeftRight },
];

export default function SuperAdminMenu() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {MENU_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive =
          href === '/dashboard' ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
