import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserWithPurchasedProductsResponse } from "../routes/myPurchase";
import { chatStore } from "./chatStore";

const emptyUser: UserWithPurchasedProductsResponse = {
  id: "",
  email: "",
  name: "",
  role: "",
  token: "",
  profile_picture: "",
  phone_number: "",
  purchasedProducts: [],
};

interface UserStore {
  user: UserWithPurchasedProductsResponse;
  setUser: (user: UserWithPurchasedProductsResponse) => void;
  clearUser: () => void;
}

export const userStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: emptyUser,
      setUser: (user) => {
        const prevId = get().user.id;
        if (prevId && prevId !== user.id) {
          chatStore.getState().clearChat();
        }
        set({ user });
      },
      clearUser: () => {
        chatStore.getState().clearChat();
        set({ user: emptyUser });
      },
    }),
    {
      name: "userInfo-storage",
    }
  )
);
