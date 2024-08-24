import styled from "styled-components";

export const CartContainer = styled.div`
  display: flex;
  background: #f1f1f1;
  height: 100vh;
  width: 100vw;
  padding: 2.3rem 2.3rem 0 2.3rem;
`;
export const ProductsInCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 45rem;
  gap: 1rem;
  margin-left: 1.2rem;

  overflow: scroll;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
`;
export const TotalValueAndConfirmPaymentButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  margin: 3rem 0 0 2rem;
  gap: 2rem;

  h2 {
    display: flex;
    justify-content: flex-end;
    min-width: 5rem;
    font-size: 1.5rem;
  }

  span {
    width: 8rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  button {
    padding: 1rem;
    width: 12rem;
    height: 4rem;
    background: #7462ba;
    color: white;
    border: none;

    &:hover {
      background: #b9b1d6;
    }
  }
`;

export const TotalValueInformationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const ProductsAndTotalValueContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
