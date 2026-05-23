import { create } from "zustand";

export interface UserPayload {}

interface AuthStore {
  accessToken: string | null;
  user: UserPayload | null;
  isLoading: boolean;
  setAuth: (token: string, user: UserPayload) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  isLoading: true,
  setAuth: (token, user) => set({ accessToken: token, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
