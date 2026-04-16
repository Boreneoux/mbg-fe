import { ForgotPasswordCard } from '@/features/auth/components/ForgotPasswordCard';

export default function ForgotPasswordPage() {
  return (
    <div className="w-full min-h-screen self-stretch relative bg-primary overflow-hidden flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute -top-44 -left-44 w-130 h-130 rounded-full bg-white/10" />
      <div className="absolute top-16 right-12 w-72 h-72 rounded-full bg-white/10" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-white/7" />
      <div className="absolute -bottom-36 left-1/3 w-105 h-105 rounded-full bg-white/10" />
      <div className="absolute bottom-16 -right-24 w-80 h-80 rounded-full bg-white/7" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 h-180 rounded-full bg-white/4" />
      <div className="absolute top-1/3 left-[30%] w-14 h-14 rounded-full bg-white/15" />
      <div className="absolute bottom-1/3 right-[28%] w-10 h-10 rounded-full bg-white/15" />
      <div className="absolute top-2/3 left-[60%] w-6 h-6 rounded-full bg-white/20" />

      <div className="relative z-10">
        <ForgotPasswordCard />
      </div>
    </div>
  );
}
