import {
  CartButton,
  CartLength,
  ChartButton,
  DeliveryButton,
  HomeButton,
  OptionsButtonsContainer,
  SideBarContainer,
} from "./styles";
import { useState } from "react";

import { IoCartOutline } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiSignInLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { productStore } from "../../store/productStore";

export default function SideBar() {
  const [buttonSelected, setButtonSelected] = useState("home");
  const navigate = useNavigate();
  const products = productStore((state) => state.products);

  function handleSetButtonSelected(button: string) {
    setButtonSelected(button);
    navigate(`/${button}`);
  }

  return (
    <SideBarContainer>
      <HomeButton $variant={buttonSelected}>
        <h2 onClick={() => setButtonSelected("home")}>Home</h2>
      </HomeButton>
      <OptionsButtonsContainer>
        <CartButton $variant={buttonSelected}>
          <IoCartOutline
            size={31}
            onClick={() => handleSetButtonSelected("cart")}
          />
          {products.length >= 1 ? (
            <CartLength>{products.length}</CartLength>
          ) : (
            <></>
          )}
        </CartButton>
        <ChartButton $variant={buttonSelected}>
          <FaRegChartBar
            size={31}
            onClick={() => handleSetButtonSelected("chart")}
          />
        </ChartButton>
        <DeliveryButton $variant={buttonSelected}>
          <CiDeliveryTruck
            size={31}
            onClick={() => handleSetButtonSelected("delivery")}
          />
        </DeliveryButton>
      </OptionsButtonsContainer>
      <PiSignInLight size={31} />
    </SideBarContainer>
  );
}
