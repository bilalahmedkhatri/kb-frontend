import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/src/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) =>
        set({ user: get().user ? { ...get().user!, ...data } : null }),
    }),
    { name: "kb-auth" }
  )
);
