import {
  CartButton,
  CartLength,
  ChartButton,
  DeliveryButton,
  HomeButton,
  OptionsButtonsContainer,
  SideBarContainer,
  SignInButton,
} from "./styles";
import { useState, useEffect } from "react";

import { IoCartOutline } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiSignInLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { productStore } from "../../store/productStore";

export default function SideBar() {
  const [buttonSelected, setButtonSelected] = useState(() => {
    return localStorage.getItem("buttonSelected") || "";
  });
  const navigate = useNavigate();
  const products = productStore((state) => state.products);

  function handleSetButtonSelected(button: string) {
    navigate(`/${button}`);
  }

  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    setButtonSelected(currentPath);
  }, [location.pathname]);

  return (
    <SideBarContainer>
      <HomeButton
        onClick={() => handleSetButtonSelected("")}
        $variant={buttonSelected}
      >
        <h2>Home</h2>
      </HomeButton>
      <OptionsButtonsContainer>
        <CartButton
          onClick={() => handleSetButtonSelected("cart")}
          $variant={buttonSelected}
        >
          <IoCartOutline size={31} />
          {products.length >= 1 ? (
            <CartLength>{products.length}</CartLength>
          ) : (
            <></>
          )}
        </CartButton>
        <ChartButton
          onClick={() => handleSetButtonSelected("chart")}
          $variant={buttonSelected}
        >
          <FaRegChartBar size={31} />
        </ChartButton>
        <DeliveryButton
          onClick={() => handleSetButtonSelected("delivery")}
          $variant={buttonSelected}
        >
          <CiDeliveryTruck size={31} />
        </DeliveryButton>
      </OptionsButtonsContainer>
      <SignInButton
        $variant={buttonSelected}
        onClick={() => handleSetButtonSelected("login")}
      >
        <PiSignInLight size={31} />
      </SignInButton>
    </SideBarContainer>
  );
}
