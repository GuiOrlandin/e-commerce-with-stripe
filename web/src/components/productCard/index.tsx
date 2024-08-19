import { Products } from "../../routes/home";
import {
  AddOrRemoveButtons,
  AddProductsToCartButton,
  ProductCartContainer,
  RemoveProductsCartButton,
  StockAndAddOrRemoveButtons,
  StockContainer,
} from "./styles";

import { useState } from "react";

interface ProductsCartProps {
  product: Products;
}

export default function ProductCart({ product }: ProductsCartProps) {
  const [productNumber, setProductNumber] = useState<number>(1);

  function handleAddProductsInCart() {
    setProductNumber(productNumber! + 1);
  }
  function handleRemoveProductsOfCart() {
    if (productNumber! > 0) {
      setProductNumber(productNumber! - 1);
    }
  }
  console.log(product);

  return (
    <ProductCartContainer>
      <h1>{product.props.name}</h1>
      <img src={`http://localhost:3333/files/${product.props.image_url}`} />
      <p>{product.props.description}</p>
      <StockAndAddOrRemoveButtons>
        <StockContainer>
          <p>{product.props.stock === 1 ? "Disponivel: " : "Disponíveis: "}</p>
          <span>{product.props.stock}</span>
        </StockContainer>
        <AddOrRemoveButtons>
          <AddProductsToCartButton onClick={() => handleAddProductsInCart()}>
            +
          </AddProductsToCartButton>
          <span>{productNumber}</span>
          <RemoveProductsCartButton
            onClick={() => handleRemoveProductsOfCart()}
          >
            -
          </RemoveProductsCartButton>
        </AddOrRemoveButtons>
      </StockAndAddOrRemoveButtons>
    </ProductCartContainer>
  );
}
