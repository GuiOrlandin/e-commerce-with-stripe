import axios from "axios";
import PurchasedProductCard from "../../components/purchaseProductCard";
import SideBar from "../../components/sidebar";
import { MyPurchasesContainer, MyPurchasesProductsContainer } from "./styles";
import { useQuery } from "@tanstack/react-query";

export interface UserWithPurchasedProductsResponse {
  email: string;
  name: string;

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
    role: string;
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
  const { data: userInfo, isLoading } =
    useQuery<UserWithPurchasedProductsResponse>({
      queryKey: ["products"],

      queryFn: async () => {
        return axios
          .get(
            `http://localhost:3333/user?userId=${"66bbe29601687421bfc7d301"}`
          )
          .then((response) => response.data);
      },
    });

  console.log(userInfo);

  return (
    <MyPurchasesContainer>
      <SideBar />
      <MyPurchasesProductsContainer>
        {userInfo!.purchasedProducts.length >= 1 ? (
          userInfo!.purchasedProducts.map((product) => (
            <PurchasedProductCard product={product} key={product.id} />
          ))
        ) : (
          <h1>Nenhum produto comprado!</h1>
        )}
      </MyPurchasesProductsContainer>
    </MyPurchasesContainer>
  );
}
