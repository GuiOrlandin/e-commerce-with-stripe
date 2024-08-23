import ProductCart from "../../components/productCard";
import SideBar from "../../components/sidebar";
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

  const totalValue = products.reduce((acc, product) => {
    return acc + product.unit_value * product.quantity;
  }, 0);

  return (
    <CartContainer>
      <SideBar />
      <ProductsAndTotalValueContainer>
        <ProductsInCartContainer>
          {products && (
            <>
              {products.map((product) => (
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
          )}
        </ProductsInCartContainer>
        <TotalValueAndConfirmPaymentButton>
          <TotalValueInformationContainer>
            <span>Valor total: </span>
            <h2>{` R$${totalValue}`}</h2>
          </TotalValueInformationContainer>
          <button>Confirmar Pagamento</button>
        </TotalValueAndConfirmPaymentButton>
      </ProductsAndTotalValueContainer>
    </CartContainer>
  );
}
