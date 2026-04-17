'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ProfileErrorState({
  message = 'Profil kamu tidak bisa dimuat. Silakan coba lagi.',
  onRetry,
}: Props) {
  return (
    <div className="rounded-2xl bg-white border border-border shadow-sm px-6 py-14 flex flex-col items-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">Terjadi kesalahan</p>
        <p className="text-xs text-muted-foreground max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" className="gap-2 mt-1" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
