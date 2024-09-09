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
        id: "",
        email: "",
        name: "",
        role: "",
        token: "",
        profile_picture: "",
        phone_number: "",
        purchasedProducts: [],
      },
      setUser: (user) => set(() => ({ user: user })),
      clearUser: () =>
        set(() => ({
          user: {
            id: "",
            email: "",
            name: "",
            role: "",
            token: "",
            profile_picture: "",
            purchasedProducts: [],
            phone_number: "",
          },
        })),
    }),
    {
      name: "userInfo-storage",
    }
  )
);
