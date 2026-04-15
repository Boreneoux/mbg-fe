import { Product } from '@/features/products/types';

// Base products shared across stores (inventory is store-specific)
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Baby Spinach',
    description: 'Fresh organic baby spinach leaves, pre-washed and ready to eat.',
    price: 18000,
    weight: 0.25,
    category_id: 1,
    category: { id: 1, name: 'Vegetables' },
    product_images: [],
  },
  {
    id: 2,
    name: 'Fuji Apple',
    description: 'Sweet and crunchy Fuji apples imported from Japan.',
    price: 35000,
    weight: 0.5,
    category_id: 2,
    category: { id: 2, name: 'Fruits' },
    product_images: [
      { id: 2, image_url: 'https://placehold.co/400x400?text=Apple', is_primary: true },
    ],
  },
  {
    id: 3,
    name: 'Free Range Eggs (12 pcs)',
    description: 'Farm-fresh free-range eggs, a dozen per pack.',
    price: 28000,
    weight: 0.72,
    category_id: 3,
    category: { id: 3, name: 'Dairy & Eggs' },
    product_images: [
      { id: 3, image_url: 'https://placehold.co/400x400?text=Eggs', is_primary: true },
    ],
  },
  {
    id: 4,
    name: 'Whole Wheat Bread',
    description: '100% whole wheat bread, high in fiber, no preservatives.',
    price: 24000,
    weight: 0.4,
    category_id: 4,
    category: { id: 4, name: 'Bakery' },
    product_images: [
      { id: 4, image_url: 'https://placehold.co/400x400?text=Bread', is_primary: true },
    ],
  },
  {
    id: 5,
    name: 'UHT Full Cream Milk 1L',
    description: 'Full cream UHT milk, rich in calcium and vitamins.',
    price: 17500,
    weight: 1.05,
    category_id: 3,
    category: { id: 3, name: 'Dairy & Eggs' },
    product_images: [
      { id: 5, image_url: 'https://placehold.co/400x400?text=Milk', is_primary: true },
    ],
  },
  {
    id: 6,
    name: 'Chicken Breast (500g)',
    description: 'Skinless boneless chicken breast, locally sourced.',
    price: 32000,
    weight: 0.5,
    category_id: 5,
    category: { id: 5, name: 'Meat & Seafood' },
    product_images: [
      { id: 6, image_url: 'https://placehold.co/400x400?text=Chicken', is_primary: true },
    ],
  },
  {
    id: 7,
    name: 'Jasmine Rice 5kg',
    description: 'Premium jasmine rice, fragrant and fluffy when cooked.',
    price: 75000,
    weight: 5.0,
    category_id: 6,
    category: { id: 6, name: 'Grains & Staples' },
    product_images: [
      { id: 7, image_url: 'https://placehold.co/400x400?text=Rice', is_primary: true },
    ],
  },
  {
    id: 8,
    name: 'Extra Virgin Olive Oil 500ml',
    description: 'Cold-pressed extra virgin olive oil from Spain.',
    price: 120000,
    weight: 0.55,
    category_id: 7,
    category: { id: 7, name: 'Oils & Condiments' },
    product_images: [
      { id: 8, image_url: 'https://placehold.co/400x400?text=OliveOil', is_primary: true },
    ],
  },
];

/**
 * Which product IDs are in stock per store.
 * Simulates StoreInventory — store 3 is missing product 8 (out of stock).
 */
export const mockStoreInventory: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5, 6, 7, 8],
  2: [1, 2, 3, 5, 6, 7],
  3: [1, 3, 4, 5, 6, 7],
};

export function getProductsByStoreId(storeId: number): Product[] {
  const productIds = mockStoreInventory[storeId] ?? [];
  return mockProducts.filter((p) => productIds.includes(p.id));
}
