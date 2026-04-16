import { ResetPasswordCard } from '@/features/auth/components/ResetPasswordCard';

type Props = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;

  return (
    <div className="w-full min-h-screen self-stretch relative bg-slate-900 overflow-hidden flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute -top-40 -left-40 w-130 h-130 rounded-full bg-white/5" />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-white/5" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-white/3" />
      <div className="absolute -bottom-32 left-1/3 w-105 h-105 rounded-full bg-white/5" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-white/3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 h-180 rounded-full bg-white/2" />

      <div className="relative z-10">
        <ResetPasswordCard token={token} />
      </div>
    </div>
  );
}
