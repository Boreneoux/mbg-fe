export type Province = {
  id: number;
  rajaongkir_province_id: number;
  name: string;
};

export type City = {
  id: number;
  rajaongkir_city_id: number;
  name: string;
  type: string | null;
  postal_code: string | null;
};

export type District = {
  id: number;
  rajaongkir_district_id: number;
  name: string;
};

export type UserAddress = {
  id: string;
  label: string | null;
  recipient_name: string;
  phone: string;
  address: string;
  district_id: number;
  city_id: number;
  province_id: number;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  is_primary: boolean;
  created_at: string;
  province: Pick<Province, 'id' | 'name'>;
  city: Pick<City, 'id' | 'name' | 'type'>;
  district: Pick<District, 'id' | 'name'>;
};
