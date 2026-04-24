import { Store } from '@/features/stores/types';
import { Product } from '@/features/products/types';

export interface StockMutation {
  id: number;
  source_store_id: number;
  destination_store_id: number;
  product_id: number;
  quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
  source_store: Store;
  destination_store: Store;
  product: Product;
}
