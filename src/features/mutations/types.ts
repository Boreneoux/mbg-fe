import { Store } from '@/features/stores/types';
import { Product } from '@/features/products/types';

export interface StockMutation {
  id: string;
  source_store_id: string;
  destination_store_id: string;
  product_id: string;
  quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
  source_store: Store;
  destination_store: Store;
  product: Product;
}
