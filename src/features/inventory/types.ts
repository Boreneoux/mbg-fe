import { Product } from '@/features/products/types';
import { Store } from '@/features/stores/types';

export interface StoreInventory {
  id: number;
  store_id: number;
  product_id: number;
  stock: number;
  created_at: string;
  updated_at: string;
  store: Store;
  product: Product;
}

export type StockJournalType = 'addition' | 'reduction' | 'mutation_in' | 'mutation_out' | 'order_deduction' | 'order_cancellation_return';

export interface StockJournal {
  id: number;
  store_inventory_id: number;
  quantity: number;
  type: StockJournalType;
  description: string | null;
  reference_id: number | null;
  created_at: string;
  store_inventory: StoreInventory;
}
