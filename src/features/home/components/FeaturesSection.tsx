import { Truck, ShoppingBag, CreditCard, Headphones } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
};

const FEATURES: Feature[] = [
  {
    icon: Truck,
    title: 'Pengiriman Cepat',
    description: 'Pesanan groceries-mu tiba dalam waktu kurang dari 2 jam.',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    icon: ShoppingBag,
    title: 'Produk Lengkap',
    description: 'Lebih dari 50.000 produk dari petani lokal dan merek terpercaya.',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: CreditCard,
    title: 'Pembayaran Aman',
    description: 'Berbagai pilihan pembayaran dengan enkripsi tingkat bank.',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Headphones,
    title: 'Dukungan 24/7',
    description: 'Tim kami siap membantu kapanpun kamu membutuhkan.',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-14 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {FEATURES.map(({ icon: Icon, title, description, iconBg, iconColor }) => (
            <div
              key={title}
              className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
              <div
                className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-7 h-7 ${iconColor}`} />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1.5">{title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
