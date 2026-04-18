export type Province = {
  id: number;
  name: string;
  rajaongkir_province_id: string;
};

export type City = {
  id: number;
  province_id: number;
  name: string;
  type: string;
  postal_code: string;
  rajaongkir_city_id: string;
};

export type District = {
  id: number;
  city_id: number;
  name: string;
  rajaongkir_district_id: string;
};

export type StoreAdminUser = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
};

export type StoreAdmin = {
  id: number;
  store_id: number;
  user_id: number;
  created_at: string;
  deleted_at: string | null;
  user: StoreAdminUser;
  store: { id: number; name: string };
};

export type Store = {
  id: number;
  name: string;
  address: string;
  district_id: number;
  city_id: number;
  province_id: number;
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

export type EligibleStoreAdminUser = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: 'store_admin';
};
