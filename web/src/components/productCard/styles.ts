import styled, { css } from "styled-components";

export const ProductContainer = styled.div`
  display: flex;
`;

export const ProductCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  padding: 1.6rem;
  border-radius: 20px;
  max-height: 30rem;
  max-width: 23.3125rem;
  box-shadow: 0 4px 16px rgba(116, 98, 186, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    box-shadow: 0 8px 24px rgba(116, 98, 186, 0.3);
  }

  img {
    width: 100%;
    height: 15.625rem;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.75rem 0;
    color: #1f2937;
    line-height: 1.3;
  }

  p {
    height: 3.1rem;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(116, 98, 186, 0.3) transparent;
    color: #6b7280;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

export const ProductInCartPageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 1.6rem;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(116, 98, 186, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  gap: 1.5rem;

  &:hover {
    box-shadow: 0 8px 24px rgba(116, 98, 186, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.08);
  }

  img {
    width: 8rem;
    height: 8rem;
    object-fit: cover;
    border-radius: 12px;
    flex-shrink: 0;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: #1f2937;
  }
`;
export const StockAndAddOrRemoveButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const ImageNameAndDescriptionInCartCard = styled.div`
  display: flex;
  gap: 1.5rem;
  flex: 1;
`;

export const UnitValueContainer = styled.div`
  display: flex;
  margin-bottom: 0.5rem;

  p {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
export const StockAndAddOrRemoveButtonsAndUnitValueInCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  min-width: 200px;

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
`;

export const TotalValueOfProduct = styled.div`
  display: flex;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const addRemoveButtonsBase = css`
  display: flex;
  padding: 0.5rem;
  align-items: center;
  gap: 0.75rem;
  border: 2px solid rgba(116, 98, 186, 0.2);
  border-radius: 12px;
  background: rgb(245, 243, 255);
  transition: all 0.2s ease;

  &:hover {
    border-color: #7462ba;
    background: rgb(250, 249, 255);
  }

  span {
    font-weight: 600;
    color: #7462ba;
    min-width: 1.5rem;
    text-align: center;
    font-size: 1rem;
  }
`;

export const AddOrRemoveButtons = styled.div`
  ${addRemoveButtonsBase}
  margin-bottom: 0.5rem;
`;

export const AddOrRemoveButtonsInCart = styled.div`
  ${addRemoveButtonsBase}
  padding: 0;
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
    color: #6b7280;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const buttonBase = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7462ba;
  background: transparent;
  border: none;
  padding: 0.25rem 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: 6px;
  min-width: 28px;
  height: 28px;

  &:hover:not(:disabled) {
    background: rgba(116, 98, 186, 0.1);
    color: #5e4a9e;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(116, 98, 186, 0.3);
  }
`;

export const AddProductsToCartButton = styled.button`
  ${buttonBase}
  background: none;
  color: #7462ba;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  padding: 0.5rem 1rem;
  min-height: 39px;
  width: 42px;
`;

export const RemoveProductsCartButton = styled.button`
  ${buttonBase}
  background: none;
  color: #7462ba;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  padding: 0.5rem 1rem;
  min-height: 39px;
  width: 42px;
`;
export const StockContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(116, 98, 186, 0.05);
  border-radius: 8px;
  max-height: 3rem;
  border: 1px solid rgba(116, 98, 186, 0.1);

  p {
    display: flex;
    align-items: center;
    margin: 0;
    font-weight: 600;
    font-size: 0.875rem;
    color: #6b7280;
  }

  span {
    font-weight: 700;
    color: #7462ba;
    font-size: 1rem;
  }
`;

export const StockContainerInCart = styled.div`
  display: flex;
  padding: 0.5rem 1rem;
  background: rgba(116, 98, 186, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(116, 98, 186, 0.1);

  p {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 0.875rem;
    margin: 0;
    color: #6b7280;
  }
`;
