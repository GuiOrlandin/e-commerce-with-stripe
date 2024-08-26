import {
  ImageQuantityTotalValueAndAdressContainer,
  PurchaseCardContainer,
  PurchaseCardContent,
  PurchaseDataContainer,
  QuantityTotalValueContainer,
  StatusOfProduct,
} from "./styles";

export default function PurchasedProductCard() {
  return (
    <PurchaseCardContainer>
      <PurchaseDataContainer>26 de agosto</PurchaseDataContainer>
      <PurchaseCardContent>
        <ImageQuantityTotalValueAndAdressContainer>
          <img
            src={`http://localhost:3333/files/1723747430288-925904753.jpg`}
          />
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
