import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroIllustration from './HeroIllustration';

const STATS = [
  { value: '50rb+', label: 'Products' },
  { value: '< 2 Jam', label: 'Delivery' },
  { value: '4.8', label: 'App Rating' }
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#fdf8f5] via-white to-orange-50/40 py-14 md:py-20 lg:py-28">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-120 h-120 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-90 h-90 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── Left: text content ───────────────────────────────── */}
          <div className="flex flex-col items-start">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Fresh Picks, Dikirim Hari Ini
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-[1.15] tracking-tight">
              Groceries Segar,{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Delivered</span>
                {/* Hand-drawn SVG underline */}
                <svg
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 w-full text-primary/35"
                  height="8"
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none">
                  <path
                    d="M0 6 Q40 1 80 6 Q120 11 160 6 Q180 3 200 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              ke Pintu Anda
            </h1>

            {/* Tagline — moved from badge into content */}
            <p className="text-sm md:text-base italic text-muted-foreground border-l-2 border-primary/40 pl-3 mb-6 leading-relaxed">
              Shop from home — semua kebutuhan dapur diantar langsung ke depan
              pintu.
            </p>

            {/* Body */}
            <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
              Browse ribuan produk segar — dari sayuran renyah sampai bahan
              dapur pilihan — dan enjoy same-day delivery ke rumahmu.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Button
                size="lg"
                className="text-base px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                asChild>
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8"
                asChild>
                <Link href="/products">Semua Kategori</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-10">
              {STATS.map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-5">
                  {i > 0 && <div className="w-px h-8 bg-border" />}
                  <div>
                    <p className="text-xl font-bold text-foreground leading-none mb-0.5">
                      {value}
                      {label === 'Rating Aplikasi' && (
                        <Star className="inline w-4 h-4 text-yellow-400 fill-yellow-400 ml-0.5 -mt-0.5" />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: illustration ──────────────────────────────── */}
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
