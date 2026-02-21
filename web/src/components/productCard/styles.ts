import styled, { css } from "styled-components";

export const ProductContainer = styled.div`
  display: flex;
`;

export const ProductImageWrapper = styled.div`
  position: relative;
  width: calc(100% + 2.5rem);
  margin: -1.25rem -1.25rem 1rem -1.25rem;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-surface-alt);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease-out;
  }
`;

export const ProductCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  max-width: 20rem;
  min-width: 0;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.35s ease-out, border-color 0.35s ease-out;

  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-border);

    ${ProductImageWrapper} img {
      transform: scale(1.02);
    }
  }

  h1 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--color-text);
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  p {
    margin: 0 0 1rem 0;
    color: var(--color-text-muted);
    font-size: 0.875rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const ProductInCartPageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-surface);
  padding: 1.6rem;
  width: 100%;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  gap: 1.5rem;

  &:hover {
    box-shadow: var(--shadow-md);
  }

  img {
    width: 8rem;
    height: 8rem;
    object-fit: cover;
    border-radius: var(--radius-md);
    flex-shrink: 0;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: var(--color-text);
  }
`;
export const StockAndAddOrRemoveButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const ImageNameAndDescriptionInCartCard = styled.div`
  display: flex;
  gap: 1.5rem;
  flex: 1;
`;

export const UnitValueContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;

  p {
    margin: 0;
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--color-primary);
    letter-spacing: -0.02em;
  }
`;
export const StockAndAddOrRemoveButtonsAndUnitValueInCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  min-width: 240px;
  flex-shrink: 0;

  p {
    display: flex;
    align-items: center;
    margin: 0;
    font-weight: 600;
  }
`;

export const StockAndAddOrRemoveButtonsInCart = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

export const TotalValueOfProduct = styled.div`
  display: flex;
  justify-content: flex-end;
  min-width: 7.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

const addRemoveButtonsBase = css`
  display: inline-flex;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: var(--color-text-subtle);
    box-shadow: var(--shadow-sm);
  }

  span {
    font-weight: 600;
    color: var(--color-text);
    min-width: 2.25rem;
    text-align: center;
    font-size: 0.9375rem;
    padding: 0 0.25rem;
    user-select: none;
  }
`;

export const AddOrRemoveButtons = styled.div`
  ${addRemoveButtonsBase}
  height: 36px;

  button {
    width: 36px;
    min-width: 36px;
    height: 36px;
    padding: 0;
    font-size: 1.25rem;
    line-height: 1;
    flex-shrink: 0;
  }

  span {
    min-width: 2.25rem;
  }
`;

export const AddOrRemoveButtonsInCart = styled.div`
  ${addRemoveButtonsBase}
  height: 40px;
  min-width: 8.5rem;
  flex-shrink: 0;

  button {
    width: 40px;
    min-width: 40px;
    height: 40px;
    padding: 0;
    font-size: 1.25rem;
    line-height: 1;
    flex-shrink: 0;
  }

  span {
    min-width: 3rem;
    font-size: 1rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }
`;
export const NameAndDescriptionInCartCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;

  h1 {
    margin: 0 0 0.5rem 0;
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const buttonBase = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  font-size: 1.125rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease-out, background 0.2s ease-out, transform 0.15s ease-out;

  &:hover:not(:disabled) {
    background: var(--color-surface-alt);
    color: var(--color-text-secondary);
  }

  &:active:not(:disabled) {
    transform: scale(0.92);
    background: var(--color-border-light);
    color: var(--color-text);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.35;
    color: var(--color-text-subtle);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px var(--color-primary);
  }
`;

export const AddProductsToCartButton = styled.button`
  ${buttonBase}
`;

export const RemoveProductsCartButton = styled.button`
  ${buttonBase}
`;

export const StockContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: var(--color-surface-alt);
  border-radius: 9999px;
  border: 1px solid var(--color-border);

  p {
    display: inline;
    margin: 0;
    font-weight: 500;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  span {
    font-weight: 600;
    color: var(--color-text);
    font-size: 0.8125rem;
  }
`;

export const StockContainerInCart = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.875rem;
  background: var(--color-surface-alt);
  border-radius: 9999px;
  border: 1px solid var(--color-border);

  p {
    margin: 0;
    font-weight: 500;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
`;
