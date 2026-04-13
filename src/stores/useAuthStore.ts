import { create } from 'zustand';
import { AuthUser } from '@/features/auth/types';

type UseAuthStore = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

const useAuthStore = create<UseAuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
