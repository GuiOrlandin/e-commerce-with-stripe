import styled from "styled-components";

export const ProductContainer = styled.div`
  display: flex;
`;
export const ProductCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  padding: 1.6rem;
  border-radius: 8px;
  max-height: 30rem;
  max-width: 23.3125rem;

  img {
    width: 19.3125rem;
    height: 15.625rem;
    border-radius: 8px;
  }

  h1 {
    font-size: 2rem;
    margin: 0 0 1rem 0;
  }

  p {
    height: 3.1rem;
    margin-top: 1rem;
    overflow: hidden;
    overflow-y: scroll;
    scrollbar-width: none;
  }
`;
export const ProductInCartPageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  padding: 1.6rem;
  width: calc(100vw - 12rem);
  border-radius: 8px;

  img {
    width: 8rem;
    border-radius: 8px;
  }

  h1 {
    font-size: 2rem;
    margin: 0 0 1rem 0;
  }
`;
export const StockAndAddOrRemoveButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.3rem;
`;
export const ImageNameAndDescriptionInCartCard = styled.div`
  display: flex;
  margin-top: 0.3rem;
`;
export const UnitValueContainer = styled.div`
  display: flex;

  p {
    margin: 0;
    height: 1.22rem;
    font-weight: bold;
  }
`;
export const StockAndAddOrRemoveButtonsAndUnitValueInCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    display: flex;
    align-items: center;
    margin: 0;
    font-weight: bold;
  }
`;
export const StockAndAddOrRemoveButtonsInCart = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.3rem;
`;
export const TotalValueOfProduct = styled.div`
  display: flex;
  left: 3.5rem;
  font-weight: bold;
`;
export const AddOrRemoveButtons = styled.div`
  display: flex;
  padding: 0.2rem;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid #7462ba;
  border-radius: 8px;
`;
export const AddOrRemoveButtonsInCart = styled.div`
  display: flex;
  padding: 0.2rem;
  border: 1px solid #7462ba;
  border-radius: 8px;
  right: 15rem;
  align-items: center;
  gap: 0.6rem;
`;
export const NameAndDescriptionInCartCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-left: 1rem;

  h1 {
    margin: 0;
  }
  p {
    margin: 0;
  }
`;
export const AddProductsToCartButton = styled.button`
  display: flex;
  color: #7462ba;
  padding: 0.1rem 0.4rem 0.3rem 0.4rem;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
  }
`;
export const RemoveProductsCartButton = styled.button`
  display: flex;
  color: #7462ba;
  padding: 0.1rem 0.4rem 0.2rem 0.4rem;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
  }
`;
export const StockContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0.3rem;
  p {
    display: flex;
    align-items: center;
    margin: 0;
    font-weight: bold;
  }

  span {
    margin-left: 0.4rem;
  }
`;
export const StockContainerInCart = styled.div`
  display: flex;

  padding-top: 1rem;
  p {
    display: flex;
    align-items: center;
    font-weight: 450;
    margin: 0;
  }
`;
