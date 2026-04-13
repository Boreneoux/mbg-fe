import Link from 'next/link';

const MENU_ITEMS = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Stores', href: '/dashboard/stores' },
  { label: 'Products', href: '/dashboard/products' },
  { label: 'Categories', href: '/dashboard/categories' },
  { label: 'Vouchers', href: '/dashboard/vouchers' },
  { label: 'Users', href: '/dashboard/users' },
  { label: 'Orders', href: '/dashboard/orders' },
];

export default function SuperAdminMenu() {
  return (
    <nav className="flex flex-col gap-1">
      {MENU_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-md px-3 py-2 text-sm hover:bg-gray-100"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
