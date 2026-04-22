import Link from 'next/link';
import { ArrowLeft, Mail, ShoppingCart } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="w-full min-h-screen self-stretch relative bg-primary overflow-hidden flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute -top-40 -left-40 w-130 h-130 rounded-full bg-white/10" />
      <div className="absolute top-16 right-10 w-72 h-72 rounded-full bg-white/10" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-white/7" />
      <div className="absolute -bottom-32 left-1/3 w-105 h-105 rounded-full bg-white/10" />
      <div className="absolute bottom-10 -right-20 w-72 h-72 rounded-full bg-white/7" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 h-180 rounded-full bg-white/4" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-4 py-12">
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
    </div>
  );
}
