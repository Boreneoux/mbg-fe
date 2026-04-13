import Link from 'next/link';
import { Button } from '@/components/ui/button';

type CategoryItem = {
  id: number;
  name: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
};

const CATEGORIES: CategoryItem[] = [
  {
    id: 1,
    name: 'Buah & Sayur',
    emoji: '🥦',
    gradientFrom: 'from-green-100',
    gradientTo: 'to-emerald-50',
    textColor: 'text-green-700',
  },
  {
    id: 2,
    name: 'Susu & Telur',
    emoji: '🥛',
    gradientFrom: 'from-blue-100',
    gradientTo: 'to-sky-50',
    textColor: 'text-blue-700',
  },
  {
    id: 3,
    name: 'Daging & Seafood',
    emoji: '🥩',
    gradientFrom: 'from-red-100',
    gradientTo: 'to-rose-50',
    textColor: 'text-red-700',
  },
  {
    id: 4,
    name: 'Roti & Kue',
    emoji: '🍞',
    gradientFrom: 'from-amber-100',
    gradientTo: 'to-yellow-50',
    textColor: 'text-amber-700',
  },
  {
    id: 5,
    name: 'Dapur & Bumbu',
    emoji: '🥫',
    gradientFrom: 'from-orange-100',
    gradientTo: 'to-amber-50',
    textColor: 'text-orange-700',
  },
  {
    id: 6,
    name: 'Minuman',
    emoji: '☕',
    gradientFrom: 'from-purple-100',
    gradientTo: 'to-violet-50',
    textColor: 'text-purple-700',
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-14 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-primary mb-1">Mau belanja apa hari ini?</p>
            <h2 className="text-2xl md:text-3xl font-bold">Belanja per Kategori</h2>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href="/products">Lihat Semua</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ id, name, emoji, gradientFrom, gradientTo, textColor }) => (
            <Link
              key={id}
              href={`/products?category=${id}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-white hover:shadow-lg hover:border-transparent hover:-translate-y-1 transition-all duration-300">
              <div
                className={`bg-linear-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center aspect-square text-5xl group-hover:scale-105 transition-transform duration-300`}>
                {emoji}
              </div>
              <div className="px-3 py-3 text-center">
                <span className={`text-xs sm:text-sm font-semibold ${textColor}`}>
                  {name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
