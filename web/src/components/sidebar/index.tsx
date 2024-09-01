import {
  CartButton,
  CartLength,
  ChartButton,
  HomeButton,
  MyPurchasesButton,
  OptionsButtonsContainer,
  SideBarContainer,
  SignInButton,
  SignOutButton,
  UserButton,
} from "./styles";
import { useState, useEffect } from "react";

import { IoCartOutline, IoPersonCircleOutline } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiSignInLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { productStore } from "../../store/productStore";
import { tokenStore } from "../../store/tokenStore";
import { GoSignIn } from "react-icons/go";

export default function SideBar() {
  const [buttonSelected, setButtonSelected] = useState<string>();
  const navigate = useNavigate();
  const products = productStore((state) => state.products);
  const clearCart = productStore((state) => state.clearCart);
  const token = tokenStore((state) => state.token);
  const removeToken = tokenStore((state) => state.removeToken);

  function handleSetButtonSelected(button: string) {
    navigate(`/${button}`);
  }

  function handleLogout() {
    removeToken();
    clearCart();
  }

  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    setButtonSelected(currentPath);
  }, [location.pathname]);

  return (
    <SideBarContainer>
      <HomeButton
        onClick={() => handleSetButtonSelected("")}
        $variant={buttonSelected!}
      >
        <h2>Home</h2>
      </HomeButton>
      <OptionsButtonsContainer>
        <CartButton
          onClick={() => handleSetButtonSelected("cart")}
          $variant={buttonSelected!}
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
          $variant={buttonSelected!}
        >
          <FaRegChartBar size={31} />
        </ChartButton>
        <MyPurchasesButton
          onClick={() => handleSetButtonSelected("my_purchases")}
          $variant={buttonSelected!}
        >
          <CiDeliveryTruck size={31} />
        </MyPurchasesButton>
        {token && (
          <UserButton
            $variant={buttonSelected!}
            onClick={() => handleSetButtonSelected("userInfo")}
          >
            <IoPersonCircleOutline size={31} />
          </UserButton>
        )}
      </OptionsButtonsContainer>
      {token ? (
        <SignOutButton
          $variant={buttonSelected!}
          onClick={() => handleLogout()}
        >
          <GoSignIn size={31} />
        </SignOutButton>
      ) : (
        <SignInButton
          $variant={buttonSelected!}
          onClick={() => handleSetButtonSelected("login")}
        >
          <PiSignInLight size={31} />
        </SignInButton>
      )}
    </SideBarContainer>
  );
}
