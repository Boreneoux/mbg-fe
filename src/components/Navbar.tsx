'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  MapPin,
  ChevronDown,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useAuthStore from '@/stores/useAuthStore';
import useLocationStore from '@/stores/useLocationStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCart } from '@/features/cart/hooks/useCart';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { DeliveryAddressSheet } from '@/features/addresses/components/DeliveryAddressSheet';
import { NavbarProfileDropdown } from '@/components/NavbarProfileDropdown';
import { NavbarCartPopover } from '@/components/NavbarCartPopover';

type ActiveOverlay = 'search' | 'nav' | null;

const NAV_LINKS = [
  { label: 'Semua Produk', href: '/products' },
  { label: 'Buah & Sayur', href: '/products?category=1' },
  { label: 'Susu & Telur', href: '/products?category=2' },
  { label: 'Daging & Seafood', href: '/products?category=3' },
  { label: 'Roti & Kue', href: '/products?category=4' },
  { label: 'Dapur & Bumbu', href: '/products?category=5' },
  { label: 'Minuman', href: '/products?category=6' }
];

export default function Navbar() {
  const { user } = useAuthStore();
  const { logout, isLoading } = useLogout();
  const displayLocation = useLocationStore(s => s.displayLocation);
  const openLocationDialog = useLocationStore(s => s.openLocationDialog);
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const overlayCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNavOverlay = useCallback(() => {
    if (overlayCloseTimer.current) {
      clearTimeout(overlayCloseTimer.current);
      overlayCloseTimer.current = null;
    }
    setActiveOverlay('nav');
  }, []);

  const closeNavOverlayDelayed = useCallback(() => {
    overlayCloseTimer.current = setTimeout(() => setActiveOverlay(null), 150);
  }, []);

  const closeOverlay = useCallback(() => {
    if (overlayCloseTimer.current) {
      clearTimeout(overlayCloseTimer.current);
      overlayCloseTimer.current = null;
    }
    setActiveOverlay(null);
  }, []);

  useEffect(() => {
    if (!activeOverlay) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeOverlay();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeOverlay, closeOverlay]);

  function handleLocationClick() {
    if (user) {
      setAddressSheetOpen(true);
    } else {
      openLocationDialog();
    }
  }

  const cart = useCartStore(s => s.cart);
  const { fetchCart } = useCart();

  useEffect(() => {
    if (user) fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <>
      {/* Overlay backdrop */}
      {activeOverlay && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-200"
          onClick={closeOverlay}
        />
      )}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top bar: Location + Promo */}
      <div className="bg-foreground text-white">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {/* Location picker */}
          <button
            onClick={handleLocationClick}
            className="group flex items-center gap-1.5 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="hidden sm:inline text-white/50 text-xs mr-0.5">
              Kirim ke
            </span>
            <span className="text-xs sm:text-sm font-medium text-white group-hover:text-primary transition-colors truncate max-w-35">
              {displayLocation ?? 'Atur lokasi'}
            </span>
            <ChevronDown className="w-3 h-3 text-white/50 group-hover:text-primary transition-colors" />
          </button>

          {/* Promo */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white/70 min-w-0">
            <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">
              Free ongkir untuk order di atas{' '}
              <span className="text-primary font-semibold">Rp 200.000</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-6">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile sheet */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 flex flex-col p-0">
                {/* Sheet header */}
                <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg">MagerBeliGrocery</span>
                </div>

                {/* Location in sheet */}
                <div className="px-6 py-3 bg-secondary/50 border-b border-border">
                  <button
                    onClick={handleLocationClick}
                    className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Kirim ke:</span>
                    <span className="font-medium text-foreground truncate max-w-40">
                      {displayLocation ?? 'Atur lokasi'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-0.5 flex-1 px-3 py-3 overflow-y-auto">
                  {NAV_LINKS.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary hover:text-primary transition-colors">
                      {label}
                    </Link>
                  ))}
                </nav>

                {/* Auth in sheet */}
                <div className="border-t border-border px-4 py-4 flex flex-col gap-2">
                  {user ? (
                    <>
                      <p className="text-xs text-muted-foreground px-1 mb-1">
                        Signed in as{' '}
                        <span className="font-semibold text-foreground">
                          {user.first_name ?? user.email}
                        </span>
                      </p>
                      <Link
                        href="/account/profile"
                        className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        My Account
                      </Link>
                      <button
                        onClick={logout}
                        disabled={isLoading}
                        className="px-3 py-2.5 rounded-lg text-sm font-medium text-left hover:bg-secondary transition-colors disabled:opacity-50 text-destructive cursor-pointer">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/auth/login">Masuk</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/auth/register">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group min-w-0">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold inline-flex whitespace-nowrap overflow-hidden">
                M
                <span className="max-w-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-w-[4ch]">
                  ager
                </span>
                B
                <span className="max-w-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-w-[3ch]">
                  eli
                </span>
                G
                <span className="max-w-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-w-[6ch]">
                  rocery
                </span>
              </span>
            </Link>
          </div>

          {/* Center: search bar */}
          <div className="flex-1 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search produk segar..."
                className="w-full pl-9 h-10 rounded-full border-border bg-secondary/60 focus:bg-white focus:border-primary transition-colors"
                onFocus={() => setActiveOverlay('search')}
                onBlur={closeOverlay}
              />
            </div>
          </div>

          {/* Right: auth + cart */}
          <div
            className="flex items-center gap-1.5 ml-auto lg:ml-0"
            onMouseEnter={openNavOverlay}
            onMouseLeave={closeNavOverlayDelayed}>
            {/* Desktop profile dropdown / auth buttons */}
            {user ? (
              <div className="hidden md:flex items-center">
                <NavbarProfileDropdown
                  user={user}
                  onLogout={() => { closeOverlay(); logout(); }}
                  isLoggingOut={isLoading}
                />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login" className="text-sm font-medium">
                    Masuk
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="shadow-sm shadow-primary/20">
                  <Link href="/auth/register" className="text-sm">
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            {/* Cart — desktop shows popover, mobile is plain link */}
            <div className="hidden md:block">
              <NavbarCartPopover cart={cart} />
            </div>
            <Link href="/cart" className="relative md:hidden">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
                {(cart?.cart_items.length ?? 0) > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-primary text-white text-xs">
                    {(cart?.cart_items.length ?? 0) > 99 ? '99+' : cart?.cart_items.length}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search produk segar..."
              className="w-full pl-9 h-10 rounded-full border-border bg-secondary/60"
              onFocus={() => setActiveOverlay('search')}
              onBlur={closeOverlay}
            />
          </div>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-6 mt-3 pt-3 border-t border-border overflow-x-auto scrollbar-none">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <DeliveryAddressSheet
        open={addressSheetOpen}
        onClose={() => setAddressSheetOpen(false)}
      />
    </header>
    </>
  );
}
