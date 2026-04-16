import { AdminLoginFormCard } from '@/features/auth/components/AdminLoginFormCard';

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50">
      {/* Subtle top accent */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-primary" />

      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <AdminLoginFormCard />
      </div>
    </div>
  );
}
