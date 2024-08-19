import styled from "styled-components";

interface ButtonSelected {
  $variant: string;
}

export const SideBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  align-items: center;
  flex-direction: column;
  background: #f8f7f7;
  width: 5.5625rem;
  height: 46rem;
  border-radius: 8px;
`;

export const OptionsButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const CartButton = styled.button<ButtonSelected>`
  border: none;
  background: ${({ $variant }) => ($variant === "cart" ? "#D9D9D9" : "")};

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
export const DeliveryButton = styled.button<ButtonSelected>`
  background: ${({ $variant }) => ($variant === "delivery" ? "#D9D9D9" : "")};
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
    $variant === "home" ? "1px solid #2906b1" : "1px solid transparent"};

  h1 {
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
