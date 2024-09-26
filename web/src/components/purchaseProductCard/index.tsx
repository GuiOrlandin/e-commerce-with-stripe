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
  image_url: string;
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
  const dateString = product.created_at;
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long" };

  const formattedDate = date.toLocaleDateString("pt-BR", options);

  return (
    <PurchaseCardContainer>
      <PurchaseDataContainer>{formattedDate}</PurchaseDataContainer>
      <PurchaseCardContent>
        <ImageQuantityTotalValueAndAdressContainer>
          <img src={`http://localhost:3333/files/${product.image_url}`} />
          <QuantityTotalValueContainer>
            <p>Quantidade: {product.quantity}</p>
            <p>
              Valor total:
              {(product.amount_total / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
              })}
            </p>
            <span>{`${product.adress.adress}, ${
              product.adress.numberAndNeighborhood.split(",")[0]
            }. `}</span>
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
