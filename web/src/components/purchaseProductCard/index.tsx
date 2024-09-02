import {
  ImageQuantityTotalValueAndAdressContainer,
  PurchaseCardContainer,
  PurchaseCardContent,
  PurchaseDataContainer,
  QuantityTotalValueContainer,
  StatusOfProduct,
} from "./styles";

export interface PurchaseProduct {
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
}

interface PurchasedProductCardProps {
  product: PurchaseProduct;
}

export default function PurchasedProductCard({
  product,
}: PurchasedProductCardProps) {
  console.log(product.image_Url);

  return (
    <PurchaseCardContainer>
      <PurchaseDataContainer>26 de agosto</PurchaseDataContainer>
      <PurchaseCardContent>
        <ImageQuantityTotalValueAndAdressContainer>
          <img src={`http://localhost:3333/files/${product.image_Url}`} />
          <QuantityTotalValueContainer>
            <p>Quantidade: 3</p>
            <p>Valor total: R$60</p>
            <span>Rua santa ernestina, 70</span>
          </QuantityTotalValueContainer>
        </ImageQuantityTotalValueAndAdressContainer>

        <StatusOfProduct>
          <p>Status</p>
          <span>Pagamento concluido!</span>
        </StatusOfProduct>
      </PurchaseCardContent>
    </PurchaseCardContainer>
  );
}
