import { create } from 'zustand';

export type OperatorType = 'cultivator' | 'manufacturer' | 'dispensary' | 'courier';

export interface User {
  id: string;
  email: string;
  businessName: string;
  operatorType: OperatorType;
  licenseNumber?: string;
  phone?: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: true, error: null }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  signOut: () => set({ user: null, isAuthenticated: false, error: null }),
}));
