import { ShoppingCart } from 'lucide-react';

export function LoginBrandPanel() {
  return (
    <div className="hidden lg:flex w-[45%] flex-col justify-between py-14 px-12 text-white select-none">
      {/* Top: logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-wide">MalesBeliGrocery</span>
      </div>

      {/* Middle: tagline + stats */}
      <div className="flex flex-col items-start">
        <h2 className="text-4xl font-bold leading-tight mb-4">
          Belanja lebih hemat,<br />hidup lebih nyaman.
        </h2>
        <p className="text-sm text-white/70 max-w-xs leading-relaxed mb-12">
          Ribuan produk segar siap diantar langsung ke pintu rumahmu, setiap hari.
        </p>

        <div className="flex gap-10">
          <div>
            <p className="text-3xl font-bold">1000+</p>
            <p className="text-xs text-white/65 mt-1">Produk segar</p>
          </div>
          <div>
            <p className="text-3xl font-bold">50+</p>
            <p className="text-xs text-white/65 mt-1">Kota tersedia</p>
          </div>
          <div>
            <p className="text-3xl font-bold">24/7</p>
            <p className="text-xs text-white/65 mt-1">Layanan aktif</p>
          </div>
        </div>
      </div>

      {/* Bottom: copyright */}
      <p className="text-xs text-white/40 font-medium tracking-widest uppercase">
        © MalesBeliGrocery
      </p>
    </div>
  );
}
