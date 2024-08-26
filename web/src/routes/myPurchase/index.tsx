import PurchasedProductCard from "../../components/purchaseProductCard";
import SideBar from "../../components/sidebar";
import { MyPurchasesContainer, MyPurchasesProductsContainer } from "./styles";

export default function MyPurchases() {
  return (
    <MyPurchasesContainer>
      <SideBar />
      <MyPurchasesProductsContainer>
        <PurchasedProductCard />
      </MyPurchasesProductsContainer>
    </MyPurchasesContainer>
  );
}
