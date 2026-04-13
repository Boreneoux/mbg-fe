export type UserAddress = {
  id: number;
  label: string | null;
  recipient_name: string;
  phone: string;
  address: string;
  city_id: number;
  province_id: number;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  is_primary: boolean;
};
