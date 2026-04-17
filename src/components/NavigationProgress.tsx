'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [complete, setComplete] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setComplete(false);
    setVisible(true);
  }, []);

  const done = useCallback(() => {
    setComplete(true);
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setComplete(false);
    }, 400);
  }, []);

  // Intercept internal link clicks to start the bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      )
        return;
      start();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [start]);

  // Complete the bar when the route actually changes
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      done();
    }
  }, [pathname, done]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[9999] h-[3px] bg-primary shadow-[0_0_8px] shadow-primary/60 transition-all ease-out ${
        complete
          ? 'w-full opacity-0 duration-300'
          : 'w-3/4 opacity-100 duration-500'
      }`}
    />
  );
}
