import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  _id: string;
  category?: string;
  created_at?: Date;
  description: string;
  image_url: string;
  name: string;
  quantity: number;
  unit_value: number;
  stock?: number;
  user_id?: string;
}

interface ProductStore {
  products: Product[];
  setProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProduct: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const productStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      setProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      removeProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p._id !== productId),
        })),
      clearCart: () =>
        set(() => ({
          products: [],
        })),
      updateProduct: (productId, quantity) =>
        set((state) => ({
          products: state.products.map((product) =>
            product._id === productId ? { ...product, quantity } : product
          ),
        })),
    }),
    {
      name: "product-storage",
    }
  )
);
