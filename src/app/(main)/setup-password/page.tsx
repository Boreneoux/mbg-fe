import { redirect } from 'next/navigation';
import { SetupPasswordCard } from '@/features/auth/components/SetupPasswordCard';

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function SetupPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) redirect('/auth/login');

  return (
    <div className="w-full min-h-screen relative bg-primary overflow-hidden flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute -top-44 -left-44 w-130 h-130 rounded-full bg-white/10" />
      <div className="absolute top-16 right-12 w-72 h-72 rounded-full bg-white/10" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-white/7" />
      <div className="absolute -bottom-36 left-1/3 w-105 h-105 rounded-full bg-white/10" />
      <div className="absolute bottom-16 -right-24 w-80 h-80 rounded-full bg-white/7" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 h-180 rounded-full bg-white/4" />

      <div className="relative z-10">
        <SetupPasswordCard token={token} />
      </div>
    </div>
  );
}
