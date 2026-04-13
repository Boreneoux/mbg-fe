export type UserRole = 'user' | 'store_admin' | 'super_admin';

export type AuthUser = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  is_verified: boolean;
  profile_image: string | null;
  referral_code: string | null;
};
