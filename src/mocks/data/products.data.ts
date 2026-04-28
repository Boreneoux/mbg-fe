import { Product } from '@/features/products/types';

export const mockProducts: Product[] = [
  {
    id: 'prod-uuid-1',
    slug: 'organic-baby-spinach',
    name: 'Organic Baby Spinach',
    description: 'Fresh organic baby spinach leaves, pre-washed and ready to eat.',
    price: 18000,
    weight: 0.25,
    category_id: 'cat-uuid-1',
    category: { id: 'cat-uuid-1', slug: 'vegetables', name: 'Vegetables' },
    product_images: [],
  },
  {
    id: 'prod-uuid-2',
    slug: 'fuji-apple',
    name: 'Fuji Apple',
    description: 'Sweet and crunchy Fuji apples imported from Japan.',
    price: 35000,
    weight: 0.5,
    category_id: 'cat-uuid-2',
    category: { id: 'cat-uuid-2', slug: 'fruits', name: 'Fruits' },
    product_images: [
      { id: 'img-uuid-2', image_url: 'https://placehold.co/400x400?text=Apple', is_primary: true },
    ],
  },
  {
    id: 'prod-uuid-3',
    slug: 'free-range-eggs-12-pcs',
    name: 'Free Range Eggs (12 pcs)',
    description: 'Farm-fresh free-range eggs, a dozen per pack.',
    price: 28000,
    weight: 0.72,
    category_id: 'cat-uuid-3',
    category: { id: 'cat-uuid-3', slug: 'dairy-eggs', name: 'Dairy & Eggs' },
    product_images: [
      { id: 'img-uuid-3', image_url: 'https://placehold.co/400x400?text=Eggs', is_primary: true },
    ],
  },
  {
    id: 'prod-uuid-4',
    slug: 'whole-wheat-bread',
    name: 'Whole Wheat Bread',
    description: '100% whole wheat bread, high in fiber, no preservatives.',
    price: 24000,
    weight: 0.4,
    category_id: 'cat-uuid-4',
    category: { id: 'cat-uuid-4', slug: 'bakery', name: 'Bakery' },
    product_images: [
      { id: 'img-uuid-4', image_url: 'https://placehold.co/400x400?text=Bread', is_primary: true },
    ],
  },
  {
    id: 'prod-uuid-5',
    slug: 'uht-full-cream-milk-1l',
    name: 'UHT Full Cream Milk 1L',
    description: 'Full cream UHT milk, rich in calcium and vitamins.',
    price: 17500,
    weight: 1.05,
    category_id: 'cat-uuid-3',
    category: { id: 'cat-uuid-3', slug: 'dairy-eggs', name: 'Dairy & Eggs' },
    product_images: [
      { id: 'img-uuid-5', image_url: 'https://placehold.co/400x400?text=Milk', is_primary: true },
    ],
  },
  {
    id: 'prod-uuid-6',
    slug: 'chicken-breast-500g',
    name: 'Chicken Breast (500g)',
    description: 'Skinless boneless chicken breast, locally sourced.',
    price: 32000,
    weight: 0.5,
    category_id: 'cat-uuid-5',
    category: { id: 'cat-uuid-5', slug: 'meat-seafood', name: 'Meat & Seafood' },
    product_images: [
      { id: 'img-uuid-6', image_url: 'https://placehold.co/400x400?text=Chicken', is_primary: true },
    ],
  },
  {
    id: 'prod-uuid-7',
    slug: 'jasmine-rice-5kg',
    name: 'Jasmine Rice 5kg',
    description: 'Premium jasmine rice, fragrant and fluffy when cooked.',
    price: 75000,
    weight: 5.0,
    category_id: 'cat-uuid-6',
    category: { id: 'cat-uuid-6', slug: 'grains-staples', name: 'Grains & Staples' },
    product_images: [
      { id: 'img-uuid-7', image_url: 'https://placehold.co/400x400?text=Rice', is_primary: true },
    ],
  },
  {
    id: 'prod-uuid-8',
    slug: 'extra-virgin-olive-oil-500ml',
    name: 'Extra Virgin Olive Oil 500ml',
    description: 'Cold-pressed extra virgin olive oil from Spain.',
    price: 120000,
    weight: 0.55,
    category_id: 'cat-uuid-7',
    category: { id: 'cat-uuid-7', slug: 'oils-condiments', name: 'Oils & Condiments' },
    product_images: [
      { id: 'img-uuid-8', image_url: 'https://placehold.co/400x400?text=OliveOil', is_primary: true },
    ],
  },
];

const mockStoreInventory: Record<string, string[]> = {
  'mock-store-uuid-1': ['prod-uuid-1', 'prod-uuid-2', 'prod-uuid-3', 'prod-uuid-4', 'prod-uuid-5', 'prod-uuid-6', 'prod-uuid-7', 'prod-uuid-8'],
  'mock-store-uuid-2': ['prod-uuid-1', 'prod-uuid-2', 'prod-uuid-3', 'prod-uuid-5', 'prod-uuid-6', 'prod-uuid-7'],
  'mock-store-uuid-3': ['prod-uuid-1', 'prod-uuid-3', 'prod-uuid-4', 'prod-uuid-5', 'prod-uuid-6', 'prod-uuid-7'],
};

export function getProductsByStoreId(storeId: string): Product[] {
  const productIds = mockStoreInventory[storeId] ?? [];
  return mockProducts.filter((p) => productIds.includes(p.id));
}
