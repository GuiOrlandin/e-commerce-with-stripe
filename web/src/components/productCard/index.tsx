import { ProductsResponse } from "../../routes/home";
import { productStore } from "../../store/productStore";
import {
  AddOrRemoveButtons,
  AddOrRemoveButtonsInCart,
  AddProductsToCartButton,
  ImageNameAndDescriptionInCartCard,
  NameAndDescriptionInCartCard,
  ProductCartContainer,
  ProductContainer,
  ProductInCartPageContainer,
  RemoveProductsCartButton,
  StockAndAddOrRemoveButtons,
  StockAndAddOrRemoveButtonsAndUnitValueInCart,
  StockAndAddOrRemoveButtonsInCart,
  StockContainer,
  StockContainerInCart,
  TotalValueOfProduct,
  UnitValueContainer,
} from "./styles";

import { useState, useEffect } from "react";

interface ProductsCartProps {
  product: ProductsResponse;
  page?: string;
}

export default function ProductCart({ product, page }: ProductsCartProps) {
  const [productNumber, setProductNumber] = useState<number>(0);
  const [productInCart, setProductInCart] = useState<boolean>(false);

  const setProduct = productStore((state) => state.setProduct);
  const removeProduct = productStore((state) => state.removeProduct);
  const productsInCart = productStore((state) => state.products);
  const updateProduct = productStore((state) => state.updateProduct);

  function handleAddProductsInCart() {
    if (product.props.stock && productNumber! < product.props.stock) {
      setProductNumber(productNumber! + 1);
    }
  }
  function handleRemoveProductsOfCart() {
    if (productNumber! > 0) {
      setProductNumber(productNumber! - 1);
    }
  }

  useEffect(() => {
    const productAlreadyInCart = productsInCart.find(
      (productsInCart) => productsInCart._id === product.props._id
    );

    if (productAlreadyInCart && !productInCart) {
      setProductInCart(true);
      setProductNumber(productAlreadyInCart.quantity);
    }

    if (productNumber > 1 && productInCart) {
      updateProduct(product.props._id, productNumber);
    }

    if (productNumber > 0 && !productInCart) {
      setProduct({
        _id: product.props._id,
        category: product.props.category,
        created_at: product.props.created_at,
        description: product.props.description,
        image_url: product.props.image_url,
        name: product.props.name,
        quantity: productNumber,
        unit_value: product.props.unit_value,
        stock: product.props.stock!,
        user_id: product.props.user_id,
      });

      setProductInCart(true);
    }

    if (productNumber === 0 && productInCart) {
      removeProduct(product.props._id);
      setProductInCart(false);
    }
  }, [productNumber]);

  console.log(product);

  return (
    <ProductContainer>
      {page === "home" ? (
        <ProductCartContainer>
          <>
            <h1>{product.props.name}</h1>
            <img
              src={`http://localhost:3333/files/${product.props.image_url}`}
            />
            <p>{product.props.description}</p>

            <UnitValueContainer>
              <p>{`R$: ${product.props.unit_value}`}</p>
            </UnitValueContainer>
            <StockAndAddOrRemoveButtons>
              <StockContainer>
                <p>
                  {product.props.stock === 1 ? "Disponivel: " : "Disponíveis: "}
                </p>
                <span>{product.props.stock}</span>
              </StockContainer>
              <AddOrRemoveButtons>
                <AddProductsToCartButton
                  disabled={productNumber! === product.props.stock}
                  onClick={() => handleAddProductsInCart()}
                >
                  +
                </AddProductsToCartButton>
                <span>{productNumber}</span>
                <RemoveProductsCartButton
                  disabled={productNumber! === 0}
                  onClick={() => handleRemoveProductsOfCart()}
                >
                  -
                </RemoveProductsCartButton>
              </AddOrRemoveButtons>
            </StockAndAddOrRemoveButtons>
          </>
        </ProductCartContainer>
      ) : (
        <ProductInCartPageContainer>
          <ImageNameAndDescriptionInCartCard>
            <img
              src={`http://localhost:3333/files/${product.props.image_url}`}
            />
            <NameAndDescriptionInCartCard>
              <h1>{product.props.name}</h1>
              <p>{product.props.description}</p>
            </NameAndDescriptionInCartCard>
          </ImageNameAndDescriptionInCartCard>
          <StockAndAddOrRemoveButtonsAndUnitValueInCart>
            <StockAndAddOrRemoveButtonsInCart>
              <AddOrRemoveButtonsInCart>
                <AddProductsToCartButton
                  disabled={productNumber! === product.props.stock}
                  onClick={() => handleAddProductsInCart()}
                >
                  +
                </AddProductsToCartButton>
                <span>{productNumber}</span>
                <RemoveProductsCartButton
                  disabled={productNumber! === 0}
                  onClick={() => handleRemoveProductsOfCart()}
                >
                  -
                </RemoveProductsCartButton>
              </AddOrRemoveButtonsInCart>
              <TotalValueOfProduct>
                {`R$ ${product.props.quantity! * product.props.unit_value}`}
              </TotalValueOfProduct>
            </StockAndAddOrRemoveButtonsInCart>
            <StockContainerInCart>
              <p>
                {product.props.stock === 1 ? "Disponivel: " : "Disponíveis: "}
              </p>
              <span>{product.props.stock}</span>
            </StockContainerInCart>
          </StockAndAddOrRemoveButtonsAndUnitValueInCart>
        </ProductInCartPageContainer>
      )}
    </ProductContainer>
  );
}
