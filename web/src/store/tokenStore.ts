import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenStore {
  token: string;
  setToken: (token: string) => void;
  removeToken: () => void;
}

export const tokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => {
        set({ token });
      },
      removeToken: () => {
        set({ token: "" });
      },
    }),
    {
      name: "jwt-storage",
    }
  )
);
