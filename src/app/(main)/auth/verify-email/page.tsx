import Link from 'next/link';
import { ArrowLeft, Mail, ShoppingCart } from 'lucide-react';
import { AuthBackground } from '@/features/auth/components/AuthBackground';

export default function VerifyEmailPage() {
  return (
    <AuthBackground className="flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-sm px-4 py-12">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 text-white">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">MagerBeliGrocery</span>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Cek email kamu</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            Kami telah mengirimkan link verifikasi ke email kamu.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Klik link tersebut untuk mengaktifkan akun dan mulai belanja.
          </p>

          <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-primary mb-8">
            Tidak menemukan emailnya? Cek folder <span className="font-semibold">spam</span> atau{' '}
            <span className="font-semibold">promotions</span> kamu.
          </div>

          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    </AuthBackground>
  );
}
