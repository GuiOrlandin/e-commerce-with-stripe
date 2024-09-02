import { useEffect } from "react";
import ProductCart from "../../components/productCard";
import SideBar from "../../components/sidebar";
import { useCheckoutMutate } from "../../hooks/useCheckoutMutate";
import { productStore } from "../../store/productStore";
import {
  CartContainer,
  ProductsAndTotalValueContainer,
  ProductsInCartContainer,
  TotalValueAndConfirmPaymentButton,
  TotalValueInformationContainer,
} from "./styles";

export default function Cart() {
  const products = productStore((state) => state.products);
  const clearCart = productStore((state) => state.clearCart);
  const { mutate, isSuccess, data } = useCheckoutMutate();

  const totalValue = products.reduce((acc, product) => {
    return acc + product.unit_value * product.quantity;
  }, 0);

  function handleCheckout() {
    mutate({
      items: products.map((product) => ({
        name: product.name,
        _id: product._id,
        image_url: product.image_url,
        description: product.description,
        quantity: product.quantity,
        unitValue: product.unit_value,
      })),
    });
  }
  useEffect(() => {
    if (isSuccess && data) {
      clearCart();
      window.location.href = data;
    }
  }, [isSuccess, data]);

  return (
    <CartContainer>
      <SideBar />
      <ProductsAndTotalValueContainer>
        <ProductsInCartContainer>
          {products && products.length >= 1 ? (
            <>
              {products &&
                products.map((product) => (
                  <ProductCart
                    page="cart"
                    product={{
                      props: {
                        _id: product._id,
                        category: product.category,
                        created_at: product.created_at,
                        description: product.description,
                        image_url: product.image_url,
                        name: product.name,
                        unit_value: product.unit_value,
                        user_id: product.user_id,
                        stock: product.stock,
                        quantity: product.quantity,
                      },
                    }}
                    key={product._id}
                  />
                ))}
            </>
          ) : (
            <>
              <h2>Sem produtos no carrinho!</h2>
            </>
          )}
        </ProductsInCartContainer>
        <TotalValueAndConfirmPaymentButton>
          <TotalValueInformationContainer>
            <span>Valor total: </span>
            <h2>{` R$${totalValue}`}</h2>
          </TotalValueInformationContainer>
          <button onClick={() => handleCheckout()}>Confirmar Pagamento</button>
        </TotalValueAndConfirmPaymentButton>
      </ProductsAndTotalValueContainer>
    </CartContainer>
  );
}
