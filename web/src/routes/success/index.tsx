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

export default function Success() {
  const navigate = useNavigate();
  const userInfo = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);
  const { data: userInfoFetched, isSuccess } = useUserFetch(userInfo!.id!);

  useEffect(() => {
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
        <SuccessButton onClick={() => navigate("/my_purchases")}>
          Ver Pedidos
        </SuccessButton>
        <SuccessButton onClick={() => navigate("/")}>
          Continuar Comprando
        </SuccessButton>
      </SuccessContent>
    </SuccessContainer>
  );
}
