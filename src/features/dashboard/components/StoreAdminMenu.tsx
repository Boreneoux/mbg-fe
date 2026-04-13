import Link from 'next/link';

const MENU_ITEMS = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Orders', href: '/dashboard/orders' },
  { label: 'Inventory', href: '/dashboard/inventory' },
  { label: 'Stock Mutations', href: '/dashboard/stock-mutations' },
  { label: 'Discounts', href: '/dashboard/discounts' },
];

export default function StoreAdminMenu() {
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
