import { Product } from '@/features/products/types';
import { Store } from '@/features/stores/types';

export interface StoreInventory {
  id: string;
  store_id: string;
  product_id: string;
  stock: number;
  created_at: string;
  updated_at: string;
  store: Store;
  product: Product;
}

export type StockJournalType = 'addition' | 'reduction' | 'mutation_in' | 'mutation_out' | 'order_deduction' | 'order_cancellation_return';

export interface StockJournal {
  id: string;
  store_inventory_id: string;
  quantity: number;
  type: StockJournalType;
  description: string | null;
  reference_id: string | null;
  created_at: string;
  store_inventory: StoreInventory;
}
