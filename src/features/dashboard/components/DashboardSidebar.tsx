'use client';

import useAuthStore from '@/stores/useAuthStore';
import SuperAdminMenu from './SuperAdminMenu';
import StoreAdminMenu from './StoreAdminMenu';

export default function DashboardSidebar() {
  const { user } = useAuthStore();

  return (
    <aside className="flex w-64 min-h-screen flex-col border-r bg-white p-4">
      <h2 className="mb-6 text-lg font-bold">MalesBeliGrocery</h2>
      {user?.role === 'super_admin' && <SuperAdminMenu />}
      {user?.role === 'store_admin' && <StoreAdminMenu />}
    </aside>
  );
}
