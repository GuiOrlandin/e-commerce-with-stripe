import styled from "styled-components";

export const MyPurchasesContainer = styled.div`
  display: flex;
  background: #f1f1f1;
  height: 100vh;
  width: 100vw;
  padding: 2.3rem;
`;
export const MyPurchasesProductsContainer = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  width: 100%;
  margin-left: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  gap: 1rem;

  h1 {
    margin-top: 5rem;
    font-size: 1.5rem;
  }
`;
