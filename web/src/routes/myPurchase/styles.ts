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
  width: calc(100vw - 13rem);
  margin-left: 1rem;
  border-radius: 8px;
  height: calc(100vh - 5rem);
  overflow: hidden;
  overflow-y: scroll;
  scrollbar-width: none;

  h1 {
    margin-top: 5rem;
    font-size: 1.5rem;
  }
`;
