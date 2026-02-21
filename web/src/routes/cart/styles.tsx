import styled, { css } from "styled-components";

export const CartContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 2rem;
`;

export const ProductsAndTotalValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
`;

export const CartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
  }
`;

export const ProductsInCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-surface-alt);
    border-radius: var(--radius-md);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: var(--radius-md);

    &:hover {
      background: var(--color-text-subtle);
    }
  }

  h2 {
    text-align: center;
    margin: 4rem 0;
    font-size: 1.25rem;
    color: var(--color-text-muted);
    font-weight: 500;
  }
`;

export const TotalValueCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-primary);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
`;

export const TotalValueAndConfirmPaymentButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TotalValueInformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  span {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-muted);
  }

  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
  }
`;

const buttonBaseStyles = css`
  border-radius: var(--radius-md);
  border: none;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  position: relative;
  letter-spacing: 0.01em;
  box-shadow: var(--shadow-sm);
  transition: background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ConfirmPaymentButton = styled.button`
  ${buttonBaseStyles}
  background: var(--color-primary);
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }

  &:hover {
    background: var(--color-primary-hover);
  }
`;
