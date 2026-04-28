export type UserAddress = {
  id: string;
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

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: 'user' | 'store_admin' | 'super_admin';
  is_verified: boolean;
  profile_image: string | null;
  referral_code: string | null;
  created_at: string;
};
