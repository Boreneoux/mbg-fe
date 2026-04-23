import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBasket } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center bg-linear-to-br from-[#fdf8f5] via-white to-orange-50/40 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-40 -right-40 w-120 h-120 rounded-full bg-primary/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-90 h-90 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative text-center px-4 py-20 max-w-lg mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShoppingBasket className="w-9 h-9 text-primary" />
            </div>
          </div>

          {/* 404 */}
          <p className="text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Error 404
          </p>

          <h1 className="text-6xl sm:text-8xl font-bold tracking-tight text-foreground mb-4 leading-none">
            Oops!
          </h1>

          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
            Halaman Tidak Ditemukan
          </h2>

          <p className="text-muted-foreground mb-10 leading-relaxed">
            Sepertinya halaman yang kamu cari sudah dipindahkan, dihapus, atau
            memang tidak pernah ada.{' '}
            <span className="text-primary font-medium">MagerBeliGrocery</span>{' '}
            tetap siap melayanimu!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" asChild>
              <Link href="/">
                Kembali ke Beranda <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">Lihat Produk</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
