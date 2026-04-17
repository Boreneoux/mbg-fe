import { ReactNode } from 'react';
import Link from 'next/link';
import { AccountSidebarNav } from '@/features/user/components/AccountSidebarNav';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">My Account</span>
        </nav>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0">
            <AccountSidebarNav />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
