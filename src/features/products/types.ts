export type ProductCategory = {
  id: number;
  name: string;
};

export type ProductImage = {
  id: number;
  image_url: string;
  is_primary: boolean;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  weight: number;
  category_id: number;
  category: ProductCategory;
  product_images: ProductImage[];
  store_inventories?: {
    id: number;
    store_id: number;
    product_id: number;
    qty: number;
  }[];
};
