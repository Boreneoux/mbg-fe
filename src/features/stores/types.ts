export type Province = {
  id: string;
  name: string;
  rajaongkir_province_id: string;
};

export type City = {
  id: string;
  province_id: string;
  name: string;
  type: string;
  postal_code: string;
  rajaongkir_city_id: string;
};

export type District = {
  id: string;
  city_id: string;
  name: string;
  rajaongkir_district_id: string;
};

export type StoreAdminUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
};

export type StoreAdmin = {
  id: string;
  store_id: string;
  user_id: string;
  created_at: string;
  deleted_at: string | null;
  user: StoreAdminUser;
  store: { id: string; name: string; slug: string };
};

export type Store = {
  id: string;
  slug: string;
  name: string;
  address: string;
  district_id: string;
  city_id: string;
  province_id: string;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  max_delivery_distance: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  province: Province;
  city: City;
  district: District;
  store_admins: StoreAdmin[];
};

export type StorePaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type EligibleStoreAdminUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: 'store_admin';
};
