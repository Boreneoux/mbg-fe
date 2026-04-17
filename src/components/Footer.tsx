import Link from 'next/link';
import { Mail, Phone, MapPin, ShoppingCart } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Shop Now', href: '/products' },
  { label: 'My Orders', href: '/account/orders' },
  { label: 'My Account', href: '/account/profile' },
  { label: 'My Cart', href: '/cart' }
];

const SUPPORT_LINKS = [
  { label: 'Help Center', href: '#' },
  { label: 'Info Pengiriman', href: '#' },
  { label: 'Return Policy', href: '#' },
  { label: 'Syarat & Ketentuan', href: '#' },
  { label: 'Privacy Policy', href: '#' }
];

const SOCIALS = [
  { label: 'Facebook', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' }
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-white mt-auto">
      {/* Brand accent strip */}
      <div className="h-1 bg-linear-to-r from-primary/60 via-primary to-primary/60" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-lg">MalesBeliGrocery</h3>
            </div>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              Online grocery store terpercaya yang deliver produk segar dan
              berkualitas langsung ke pintu rumahmu.
            </p>
            <div className="flex flex-wrap gap-3">
              {SOCIALS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-xs text-gray-400 hover:text-primary transition-colors border border-white/10 rounded-full px-3 py-1 hover:border-primary/40">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-base mb-4">Customer Service</h3>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base mb-4">Contact Us</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span className="text-sm text-gray-400">
                  0800-MALES-BELI
                  <br />
                  <span className="text-gray-500 text-xs">
                    (0800-6253-2354)
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span className="text-sm text-gray-400">
                  support@malesbeligrocery.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span className="text-sm text-gray-400">
                  Jl. Sudirman No. 123
                  <br />
                  Jakarta, 10220
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} MalesBeliGrocery. All rights
            reserved.
          </p>
          <p className="text-xs">Made with ❤️ by Group 1</p>
        </div>
      </div>
    </footer>
  );
}
