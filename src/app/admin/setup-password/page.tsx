import { redirect } from 'next/navigation';
import { AdminSetupPasswordForm } from '@/features/auth/components/AdminSetupPasswordForm';

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function AdminSetupPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) redirect('/admin/login');

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50">
      {/* Top accent bar */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-primary" />

      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <AdminSetupPasswordForm token={token} />
      </div>
    </div>
  );
}
