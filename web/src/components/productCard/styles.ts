import styled from "styled-components";

export const ProductCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  max-height: 22rem;
  max-width: 20.3125rem;
  img {
    width: 19.3125rem;
    height: 10.625rem;
    border-radius: 8px;
  }

  h1 {
    font-size: 2rem;
    margin: 0 0 1rem 0;
  }

  p {
    height: 2.7rem;
    overflow: hidden;
    overflow-y: scroll;
    scrollbar-width: none;
  }
`;
export const StockAndAddOrRemoveButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.3rem;
`;
export const AddOrRemoveButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;
export const AddProductsToCartButton = styled.button`
  display: flex;
  background: #d9d9d9;
  padding: 0.1rem 0.4rem 0.3rem 0.4rem;
`;
export const RemoveProductsCartButton = styled.button`
  display: flex;
  background: #d9d9d9;
  padding: 0.1rem 0.4rem 0.2rem 0.4rem;
`;
export const StockContainer = styled.div`
  display: flex;
  margin: 0;
  padding-top: 0.3rem;
  p {
    margin: 0;
    font-weight: bold;
  }

  span {
    margin-left: 0.2rem;
  }
`;
