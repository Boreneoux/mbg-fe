import {
  Leaf,
  Milk,
  Drumstick,
  Wheat,
  Package,
  Coffee,
  ShoppingCart,
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

type FloatingItem = {
  icon: LucideIcon;
  bg: string;
  iconColor: string;
  animClass: string;
  posClass: string;
  /** container diameter */
  size: string;
  /** icon size inside */
  iconSize: string;
};

// 6-item clock arrangement: 12 / 2 / 4 / 6 / 8 / 10 o'clock
const FLOATING_ITEMS: FloatingItem[] = [
  {
    icon: Leaf,
    bg: 'bg-green-100',
    iconColor: 'text-green-600',
    animClass: 'animate-float',
    posClass: 'top-[5%] left-1/2 -translate-x-1/2',
    size: 'w-14 h-14',
    iconSize: 'w-7 h-7',
  },
  {
    icon: Milk,
    bg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    animClass: 'animate-float-1',
    posClass: 'top-[20%] right-[10%]',
    size: 'w-12 h-12',
    iconSize: 'w-6 h-6',
  },
  {
    icon: Drumstick,
    bg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    animClass: 'animate-float-2',
    posClass: 'bottom-[20%] right-[10%]',
    size: 'w-14 h-14',
    iconSize: 'w-7 h-7',
  },
  {
    icon: Wheat,
    bg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    animClass: 'animate-float-3',
    posClass: 'bottom-[5%] left-1/2 -translate-x-1/2',
    size: 'w-12 h-12',
    iconSize: 'w-6 h-6',
  },
  {
    icon: Coffee,
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    animClass: 'animate-float-4',
    posClass: 'bottom-[20%] left-[10%]',
    size: 'w-14 h-14',
    iconSize: 'w-7 h-7',
  },
  {
    icon: Package,
    bg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    animClass: 'animate-float-5',
    posClass: 'top-[20%] left-[10%]',
    size: 'w-12 h-12',
    iconSize: 'w-6 h-6',
  },
];

export default function HeroIllustration() {
  return (
    <div className="relative flex items-center justify-center h-72 sm:h-80 lg:h-105 select-none">
      {/* Rotating dashed ring */}
      <div className="absolute inset-4 lg:inset-8 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />

      {/* Soft glow circles */}
      <div className="absolute w-52 h-52 lg:w-64 lg:h-64 rounded-full bg-linear-to-br from-primary/20 to-primary/5" />
      <div className="absolute w-36 h-36 lg:w-44 lg:h-44 rounded-full bg-linear-to-tr from-primary/10 to-orange-100/40" />

      {/* Central shopping cart */}
      <div className="relative z-10 w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/30 animate-float">
        <ShoppingCart className="w-9 h-9 lg:w-11 lg:h-11 text-white" />
      </div>

      {/* Orbiting category icons */}
      {FLOATING_ITEMS.map(({ icon: Icon, bg, iconColor, animClass, posClass, size, iconSize }) => (
        <div
          key={posClass}
          className={`absolute ${posClass} ${animClass}`}>
          <div
            className={`${size} rounded-2xl ${bg} flex items-center justify-center shadow-md`}>
            <Icon className={`${iconSize} ${iconColor}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
