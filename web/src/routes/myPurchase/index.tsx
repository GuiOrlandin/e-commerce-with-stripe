import PurchasedProductCard from "../../components/purchaseProductCard";
import SideBar from "../../components/sidebar";
import { MyPurchasesContainer, MyPurchasesProductsContainer } from "./styles";
import { userStore } from "../../store/userStore";
import { v4 as uuidv4 } from "uuid";

export interface UserWithPurchasedProductsResponse {
  email: string;
  name: string;
  role: string;
  token: string;
  id: string;
  adress?: string;
  number?: string;
  profile_picture?: string;
  phone_number: string;

  purchasedProducts: {
    amount_total: number;
    id: string;
    description: string;
    name: string;
    image_Url: string;
    unit_amount: number;
    quantity: number;
    created_at: Date;
    stock: number;
    adress: {
      city: string;
      country: string;
      adress: string;
      numberAndNeighborhood: string;
      postalCode: string;
    };
  }[];
}

export default function MyPurchases() {
  const userInfo = userStore((state) => state.user);

  return (
    <MyPurchasesContainer>
      <SideBar />

      <MyPurchasesProductsContainer>
        {userInfo &&
        userInfo!.purchasedProducts &&
        userInfo!.purchasedProducts.length >= 1 ? (
          userInfo!.purchasedProducts.map((product) => (
            <PurchasedProductCard
              product={product}
              key={product.id + uuidv4()}
            />
          ))
        ) : (
          <h1>Nenhum produto comprado!</h1>
        )}
      </MyPurchasesProductsContainer>
    </MyPurchasesContainer>
  );
}
