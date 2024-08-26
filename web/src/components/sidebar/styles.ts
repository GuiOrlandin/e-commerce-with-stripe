import styled from "styled-components";

interface ButtonSelected {
  $variant: string;
}

export const SideBarContainer = styled.aside`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  align-items: center;
  flex-direction: column;
  background: #f8f7f7;
  width: 5.5625rem;
  height: 50rem;
  border-radius: 8px;
`;

export const OptionsButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const CartLength = styled.div`
  display: flex;
  position: absolute;
  margin-left: 1.2rem;
  bottom: 12px;
  padding: 0rem 0.5rem 0.2rem 0.5rem;
  border-radius: 999px;
  background: #7462ba;
`;
export const CartButton = styled.button<ButtonSelected>`
  border: none;
  background: ${({ $variant }) => ($variant === "cart" ? "#D9D9D9" : "")};
  position: relative;

  padding: 1rem;
  &:hover {
    cursor: pointer;
    background: #d9d9d9;
    border-radius: 8px;
    border: none;
  }
`;
export const ChartButton = styled.button<ButtonSelected>`
  background: ${({ $variant }) => ($variant === "chart" ? "#D9D9D9" : "")};
  border: none;

  padding: 1rem;
  &:hover {
    cursor: pointer;
    background: #d9d9d9;
    border-radius: 8px;
    border: none;
  }
`;
export const MyPurchasesButton = styled.button<ButtonSelected>`
  background: ${({ $variant }) => ($variant === "my_purchases" ? "#D9D9D9" : "")};
  border: none;

  padding: 1rem;
  &:hover {
    cursor: pointer;
    background: #d9d9d9;
    border-radius: 8px;
    border: none;
  }
`;
export const HomeButton = styled.div<ButtonSelected>`
  border-bottom: ${({ $variant }) =>
    $variant === "" ? "1px solid #2906b1" : "1px solid transparent"};

  h2 {
    margin: 0;
    font-size: 1.8rem;
    color: #2906b1;
    border-bottom: 1px solid transparent;

    &:hover {
      cursor: pointer;
      border-bottom: 1px solid #2906b1;
    }
  }
`;

export const SignOutButton = styled.button<ButtonSelected>`
  border: none;

  padding: 1rem;
  &:hover {
    cursor: pointer;
    background: #d9d9d9;
    border-radius: 8px;
    border: none;
  }
`;

export const SignInButton = styled.button<ButtonSelected>`
  background: ${({ $variant }) => ($variant === "login" ? "#D9D9D9" : "")};
  border: none;

  padding: 1rem;
  &:hover {
    cursor: pointer;
    background: #d9d9d9;
    border-radius: 8px;
    border: none;
  }
`;
export const UserButton = styled.button<ButtonSelected>`
  background: ${({ $variant }) => ($variant === "userInfo" ? "#D9D9D9" : "")};
  border: none;

  padding: 1rem;
  &:hover {
    cursor: pointer;
    background: #d9d9d9;
    border-radius: 8px;
    border: none;
  }
`;
