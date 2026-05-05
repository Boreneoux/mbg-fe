import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
};

export function AuthBackground({ children, className }: Props) {
  return (
    <div
      className={cn(
        'w-full min-h-screen self-stretch relative overflow-hidden bg-linear-to-br from-[#9E4A28] via-primary to-[#E8925D]',
        className,
      )}
    >
      {/* Depth blobs */}
      <div className="absolute -top-44 -left-44 w-130 h-130 rounded-full bg-black/15" />
      <div className="absolute -bottom-36 right-1/4 w-105 h-105 rounded-full bg-black/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 h-180 rounded-full bg-white/5" />

      {/* Floating grocery items */}
      <span className="absolute top-[5%] right-[5%] text-9xl opacity-[0.12] select-none pointer-events-none animate-float rotate-12">🥦</span>
      <span className="absolute top-[15%] left-[6%] text-6xl opacity-[0.09] select-none pointer-events-none animate-float-2 -rotate-8">🍅</span>
      <span className="absolute top-[48%] left-[1%] text-8xl opacity-[0.12] select-none pointer-events-none animate-float-3 -rotate-10">🥕</span>
      <span className="absolute bottom-[38%] left-[10%] text-5xl opacity-[0.08] select-none pointer-events-none animate-float-6 -rotate-12">🍋</span>
      <span className="absolute bottom-[6%] left-[6%] text-8xl opacity-[0.12] select-none pointer-events-none animate-float-4 rotate-18">🍎</span>
      <span className="absolute top-[22%] right-[14%] text-6xl opacity-[0.09] select-none pointer-events-none animate-float-5 rotate-6">🥑</span>
      <span className="absolute top-[70%] right-[5%] text-7xl opacity-[0.10] select-none pointer-events-none animate-float-1 rotate-10">🍊</span>
      <span className="absolute bottom-[8%] right-[4%] text-9xl opacity-[0.10] select-none pointer-events-none animate-float -rotate-20">🌽</span>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
