import { Gift, ShoppingCart, Truck, Zap } from 'lucide-react';

const PERKS = [
  { icon: Truck, text: 'Gratis ongkir untuk order pertama' },
  { icon: Gift, text: 'Dapatkan kode referral eksklusif' },
  { icon: Zap, text: 'Pengiriman same-day tersedia' },
] as const;

export function RegisterBrandPanel() {
  return (
    <div className="hidden lg:flex w-[45%] flex-col justify-between py-14 px-12 text-white select-none">
      {/* Top: logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-wide">MalesBeliGrocery</span>
      </div>

      {/* Middle: tagline + perks */}
      <div className="flex flex-col items-start">
        <h2 className="text-4xl font-bold leading-tight mb-4">
          Gabung sekarang,<br />nikmati kemudahannya.
        </h2>
        <p className="text-sm text-white/70 max-w-xs leading-relaxed mb-12">
          Daftar gratis dan mulai belanja kebutuhan sehari-hari dengan mudah, cepat, dan hemat.
        </p>

        <div className="flex flex-col gap-5">
          {PERKS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-white/80">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: copyright */}
      <p className="text-xs text-white/40 font-medium tracking-widest uppercase">
        MalesBeliGrocery
      </p>
    </div>
  );
}
