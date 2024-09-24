import {
  SuccessContainer,
  SuccessContent,
  SuccessMessage,
  SuccessButton,
} from "./styles";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useUserFetch } from "../../hooks/useUserInfoFetch";
import { userStore } from "../../store/userStore";
import { useEffect } from "react";
import { productStore } from "../../store/productStore";

export default function Success() {
  const navigate = useNavigate();
  const userInfo = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);
  const clearCart = productStore((state) => state.clearCart);

  const { data: userInfoFetched, isSuccess } = useUserFetch(userInfo!.id!);

  useEffect(() => {
    clearCart();

    if (isSuccess && userInfoFetched) {
      setUser({
        ...userInfo,
        purchasedProducts: userInfoFetched.purchasedProducts,
      });
    }
  }, [isSuccess, userInfoFetched]);

  return (
    <SuccessContainer>
      <SuccessContent>
        <IoMdCheckmarkCircle size={120} color="#4CC760" />
        <h1>Compra efetuada!</h1>
        <SuccessMessage>
          Obrigado pela sua compra! Seu pedido será processado em breve.
        </SuccessMessage>
        <SuccessButton
          data-testid="see-purchases"
          onClick={() => navigate("/my_purchases")}
        >
          Ver Pedidos
        </SuccessButton>
        <SuccessButton
          data-testid="home-page-button"
          onClick={() => navigate("/")}
        >
          Continuar Comprando
        </SuccessButton>
      </SuccessContent>
    </SuccessContainer>
  );
}
