import { ProductsResponse } from "../../routes/home";
import { Product, productStore } from "../../store/productStore";
import {
  AddOrRemoveButtons,
  AddProductsToCartButton,
  ProductCartContainer,
  RemoveProductsCartButton,
  StockAndAddOrRemoveButtons,
  StockContainer,
} from "./styles";

import { useState, useEffect } from "react";

interface ProductsCartProps {
  product: ProductsResponse;
}

export default function ProductCart({ product }: ProductsCartProps) {
  const [productNumber, setProductNumber] = useState<number>(0);
  const [productInCart, setProductInCart] = useState<boolean>(false);

  const setProduct = productStore((state) => state.setProduct);
  const removeProduct = productStore((state) => state.removeProduct);
  const productsInCart = productStore((state) => state.products);

  function handleAddProductsInCart() {
    if (productNumber! < product.props.stock) {
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
      setProductNumber(1);
      console.log("oi");
    }

    if (productNumber > 0 && !productInCart) {
      setProduct({
        _id: product.props._id,
        category: product.props.category,
        created_at: product.props.created_at,
        description: product.props.description,
        image_url: product.props.image_url,
        name: product.props.name,
        stock: product.props.stock,
        unit_value: product.props.unit_value,
        user_id: product.props.user_id,
      });

      setProductInCart(true);
    }

    if (productNumber === 0 && productInCart) {
      removeProduct(product.props._id);
      setProductInCart(false);
    }
  }, [productNumber]);

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
    </ProductCartContainer>
  );
}
