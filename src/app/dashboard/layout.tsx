import { ReactNode } from 'react';
import DashboardSidebar from '@/features/dashboard/components/DashboardSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <DashboardSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
