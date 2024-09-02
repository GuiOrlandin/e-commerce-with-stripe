import {
  SuccessContainer,
  SuccessContent,
  SuccessMessage,
  SuccessButton,
} from "./styles";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

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
