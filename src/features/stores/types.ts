export type Store = {
  id: number;
  name: string;
  address: string;
  city_id: number;
  province_id: number;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  max_delivery_distance: number;
};
