import styled from "styled-components";

export const CartContainer = styled.div`
  display: flex;
  background: #f1f1f1;
  width: 100vw;
  height: 100vh;
  padding: 2.3rem;
`;

export const ProductsInCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 47rem;
  gap: 1rem;
  margin-left: 1.2rem;
  overflow: scroll;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  h2 {
    text-align: center;
    margin: 6rem 0 0 0;
    font-size: 1.7rem;
  }
`;

export const TotalValueAndConfirmPaymentButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin-top: 3rem; */
  padding: 0 2rem;
  gap: 2rem;

  h2 {
    font-size: 1.5rem;
  }

  span {
    font-size: 1.5rem;
    font-weight: bold;
  }

  button {
    padding: 1rem;
    background: #7462ba;
    color: white;
    border: none;
    margin-left: auto;

    &:hover {
      background: #b9b1d6;
    }
  }
`;

export const TotalValueInformationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ProductsAndTotalValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
