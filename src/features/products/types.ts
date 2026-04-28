export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
};

export type ProductImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  weight: number;
  category_id: string;
  category: ProductCategory;
  product_images: ProductImage[];
  store_inventories?: {
    id: string;
    store_id: string;
    product_id: string;
    stock: number;
  }[];
};
