import { useEffect, useState } from "react";
import {
  CartButton,
  CartLength,
  ChartButton,
  HomeButton,
  MyPurchasesButton,
  OptionsButtonsContainer,
  ProductsButton,
  SideBarContainer,
  SignInButton,
  SignOutButton,
  UserButton,
} from "./styles";

import { CiDeliveryTruck } from "react-icons/ci";
import { FaRegChartBar } from "react-icons/fa";
import { GoSignIn } from "react-icons/go";
import { IoAddCircleOutline, IoCartOutline, IoPersonCircleOutline } from "react-icons/io5";
import { PiSignInLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { productStore } from "../../store/productStore";
import { userStore } from "../../store/userStore";

export default function SideBar() {
  const [buttonSelected, setButtonSelected] = useState<string>();
  const navigate = useNavigate();
  const products = productStore((state) => state.products);
  const clearCart = productStore((state) => state.clearCart);
  const user = userStore((state) => state.user);
  const clearUser = userStore((state) => state.clearUser);

  function handleSetButtonSelected(button: string) {
    navigate(`/${button}`);
  }

  function handleLogout() {
    clearUser();
    clearCart();

    navigate("/login");
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
        {user && user.token && (
          <>
            <CartButton
              onClick={() => handleSetButtonSelected("cart")}
              $variant={buttonSelected!}
              $activePath="cart"
            >
              <IoCartOutline size={31} />
              {products.length >= 1 ? (
                <CartLength>{products.length}</CartLength>
              ) : (
                <></>
              )}
            </CartButton>

            {user && user.token && user.role === "ADMIN" && (
              <>
                <ProductsButton
                  onClick={() => handleSetButtonSelected("products")}
                  $variant={buttonSelected!}
                  $activePath="products"
                >
                  <IoAddCircleOutline size={31} />
                </ProductsButton>
                <ChartButton
                  onClick={() => handleSetButtonSelected("dashboard")}
                  $variant={buttonSelected!}
                  $activePath="dashboard"
                >
                  <FaRegChartBar size={31} />
                </ChartButton>
              </>
            )}

            <MyPurchasesButton
              onClick={() => handleSetButtonSelected("my_purchases")}
              $variant={buttonSelected!}
              $activePath="my_purchases"
            >
              <CiDeliveryTruck size={31} />
            </MyPurchasesButton>
            <UserButton
              $variant={buttonSelected!}
              $activePath="profile"
              onClick={() => handleSetButtonSelected("profile")}
            >
              <IoPersonCircleOutline size={31} />
            </UserButton>
          </>
        )}
      </OptionsButtonsContainer>
      {user && user.token ? (
        <SignOutButton
          $variant={buttonSelected!}
          onClick={() => handleLogout()}
        >
          <GoSignIn size={31} />
        </SignOutButton>
      ) : (
        <SignInButton
          $variant={buttonSelected!}
          $activePath="login"
          onClick={() => handleSetButtonSelected("login")}
        >
          <PiSignInLight size={31} />
        </SignInButton>
      )}
    </SideBarContainer>
  );
}
