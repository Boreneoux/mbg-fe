'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';

function getMainOffset(): number {
  if (typeof window === 'undefined') return 160;
  if (window.innerWidth >= 1024) return 160; // desktop: top bar + logo row + nav strip
  if (window.innerWidth >= 768) return 112;  // tablet: top bar + logo/search row only
  return 160;                                // mobile: top bar + logo + search bar
}

export function AppToaster() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  const [mainOffset, setMainOffset] = useState(getMainOffset);

  useEffect(() => {
    function handleResize() {
      setMainOffset(getMainOffset());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <Toaster offset={isAdmin ? 16 : mainOffset} />;
}
