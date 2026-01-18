import styled, { css } from "styled-components";

interface ButtonSelected {
  $variant: string;
}

export const SideBarContainer = styled.aside`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 0.75rem;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(116, 98, 186, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08);
  background: linear-gradient(180deg, #ffffff 0%, #faf9ff 100%);
  height: 700px;
  height: 700px;
  border-radius: 20px;
  border-right: 2px solid rgba(116, 98, 186, 0.1);
  top: 0;
`;

export const OptionsButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

export const CartLength = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 0.6875rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
  border: 2px solid white;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const baseButtonStyles = css<ButtonSelected & { $activePath?: string }>`
  border: none;
  background: ${({ $variant, $activePath }) =>
    $variant === $activePath
      ? "linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%)"
      : "transparent"};
  color: ${({ $variant, $activePath }) =>
    $variant === $activePath ? "#ffffff" : "#6b7280"};
  padding: 0.875rem;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: ${({ $variant, $activePath }) =>
      $variant === $activePath ? "60%" : "0%"};
    background: linear-gradient(180deg, #7462ba 0%, #5e4a9e 100%);
    border-radius: 0 4px 4px 0;
    transition: height 0.3s ease;
  }

  &:focus {
    outline: none;
  }

  &:hover {
    background: ${({ $variant, $activePath }) =>
      $variant === $activePath
        ? "linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%)"
        : "rgba(116, 98, 186, 0.1)"};
    color: ${({ $variant, $activePath }) =>
      $variant === $activePath ? "#ffffff" : "#7462ba"};
    box-shadow: ${({ $variant, $activePath }) =>
      $variant === $activePath
        ? "0 4px 12px rgba(116, 98, 186, 0.3)"
        : "none"};
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

export const CartButton = styled.button<ButtonSelected & { $activePath: string }>`
  ${baseButtonStyles}
  ${({ $variant }) =>
    $variant === "cart" &&
    css`
      box-shadow: 0 4px 16px rgba(116, 98, 186, 0.3);
    `}
`;

export const ProductsButton = styled.button<
  ButtonSelected & { $activePath: string }
>`
  ${baseButtonStyles}
`;

export const ChartButton = styled.button<
  ButtonSelected & { $activePath: string }
>`
  ${baseButtonStyles}
`;

export const MyPurchasesButton = styled.button<
  ButtonSelected & { $activePath: string }
>`
  ${baseButtonStyles}
`;

export const UserButton = styled.button<ButtonSelected & { $activePath: string }>`
  ${baseButtonStyles}
`;

export const HomeButton = styled.div<ButtonSelected>`
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  width: 100%;
  position: relative;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    background: ${({ $variant }) =>
      $variant === ""
        ? "linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%)"
        : "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $variant }) => ($variant === "" ? "80%" : "0%")};
    height: 3px;
    background: linear-gradient(90deg, #7462ba 0%, #5e4a9e 100%);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  &:hover {
    background: rgba(116, 98, 186, 0.08);

    h2 {
      background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    &::after {
      width: 80%;
    }
  }
`;

export const SignOutButton = styled.button<
  ButtonSelected & { $activePath?: string }
>`
  ${baseButtonStyles}
  margin-top: auto;
  color: #ef4444;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    box-shadow: none;
  }
`;

export const SignInButton = styled.button<
  ButtonSelected & { $activePath: string }
>`
  ${baseButtonStyles}
  margin-top: auto;
`;
