import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserWithPurchasedProductsResponse } from "../routes/myPurchase";

interface UserStore {
  user: UserWithPurchasedProductsResponse;
  setUser: (user: UserWithPurchasedProductsResponse) => void;
  clearUser: () => void;
}

export const userStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        email: "",
        name: "",
        role: "",
        token: "",

        purchasedProducts: [],
      },
      setUser: (user) => set(() => ({ user: user })),
      clearUser: () =>
        set(() => ({
          user: {
            email: "",
            name: "",
            role: "",
            token: "",
            purchasedProducts: [],
          },
        })),
    }),
    {
      name: "userInfo-storage",
    }
  )
);
