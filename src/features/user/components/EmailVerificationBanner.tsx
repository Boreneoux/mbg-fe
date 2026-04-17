'use client';

import { Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResendVerification } from '../hooks/useUpdateProfile';

interface Props {
  email: string;
  isEmailChanged?: boolean;
}

export function EmailVerificationBanner({ email, isEmailChanged = false }: Props) {
  const { resend, isSending } = useResendVerification();

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800">
          {isEmailChanged ? 'Email diubah — verifikasi diperlukan' : 'Email belum diverifikasi'}
        </p>
        <p className="mt-0.5 text-xs text-amber-700">
          {isEmailChanged
            ? `Link verifikasi dikirim ke ${email}. Cek inbox kamu untuk menyelesaikan perubahan.`
            : `Kami mengirim link verifikasi ke ${email}. Verifikasi untuk mengakses semua fitur.`}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-7 gap-1.5 px-2 text-xs text-amber-700 hover:bg-amber-100 hover:text-amber-900"
          disabled={isSending}
          onClick={() => resend(email)}
        >
          <Mail className="h-3.5 w-3.5" />
          {isSending ? 'Mengirim…' : 'Kirim ulang email verifikasi'}
        </Button>
      </div>
    </div>
  );
}
