import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TUser } from "@/modules/auth/types";

type TAuthState = {
  user: TUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: TUser, token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<TAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "dwp-auth",
    },
  ),
);
