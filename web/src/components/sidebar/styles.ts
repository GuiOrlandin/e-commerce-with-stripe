import styled, { css } from "styled-components";

interface ButtonSelected {
  $variant: string;
}

export const SideBarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--sidebar-width);
  min-height: 100vh;
  flex-shrink: 0;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  padding: var(--space-5) var(--space-3);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  box-shadow: var(--shadow-sidebar);

  /* Thin accent on right edge */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    background: var(--color-primary);
    opacity: 0.35;
    border-radius: 2px 0 0 2px;
  }
`;

export const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: var(--space-6);
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #fff;
  flex-shrink: 0;
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  box-shadow: var(--shadow-sm);
  transition: background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
  }

  span {
    color: inherit;
  }
`;

export const OptionsButtonsContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 100%;
  flex: 1;
`;

export const CartLength = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: var(--color-error);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  border: 2px solid var(--color-surface);
  box-shadow: var(--shadow-xs);
`;

const navButtonStyles = css<ButtonSelected & { $activePath?: string }>`
  border: none;
  background: ${({ $variant, $activePath }) =>
    $variant === $activePath ? "var(--color-primary)" : "transparent"};
  color: ${({ $variant, $activePath }) =>
    $variant === $activePath ? "#ffffff" : "var(--color-text-muted)"};
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:focus {
    outline: none;
    box-shadow: var(--shadow-focus);
  }

  &:hover {
    background: ${({ $variant, $activePath }) =>
      $variant === $activePath
        ? "var(--color-primary-hover)"
        : "var(--color-primary-light)"};
    color: ${({ $variant, $activePath }) =>
      $variant === $activePath ? "#ffffff" : "var(--color-primary)"};
  }

  &:active {
    transform: scale(0.97);
  }

  svg {
    flex-shrink: 0;
  }
`;

export const CartButton = styled.button<ButtonSelected & { $activePath: string }>`
  ${navButtonStyles}
`;

export const ProductsButton = styled.button<
  ButtonSelected & { $activePath: string }
>`
  ${navButtonStyles}
`;

export const ChartButton = styled.button<
  ButtonSelected & { $activePath: string }
>`
  ${navButtonStyles}
`;

export const ChatButton = styled.button<
  ButtonSelected & { $activePath: string }
>`
  ${navButtonStyles}
`;

export const MyPurchasesButton = styled.button<
  ButtonSelected & { $activePath: string }
>`
  ${navButtonStyles}
`;

export const UserButton = styled.button<ButtonSelected & { $activePath: string }>`
  ${navButtonStyles}
`;

export const HomeButton = styled.button<ButtonSelected>`
  ${navButtonStyles}
  width: 52px;
  margin-bottom: var(--space-2);
  background: ${({ $variant }) =>
    $variant === "" ? "var(--color-primary)" : "transparent"};
  color: ${({ $variant }) =>
    $variant === "" ? "#ffffff" : "var(--color-text-muted)"};

  &:hover {
    background: ${({ $variant }) =>
      $variant === ""
        ? "var(--color-primary-hover)"
        : "var(--color-primary-light)"};
    color: ${({ $variant }) =>
      $variant === "" ? "#ffffff" : "var(--color-primary)"};
  }
`;

export const SidebarDivider = styled.div`
  width: 100%;
  height: 1px;
  background: var(--color-border);
  margin: var(--space-3) 0;
  flex-shrink: 0;
`;

export const SignOutButton = styled.button<
  ButtonSelected & { $activePath?: string }
>`
  ${navButtonStyles}
  margin-top: auto;
  color: var(--color-error);

  &:hover {
    background: rgba(239, 68, 68, 0.08);
    color: var(--color-error-hover);
  }
`;

export const SignInButton = styled.button<
  ButtonSelected & { $activePath: string }
>`
  ${navButtonStyles}
  margin-top: auto;
`;
