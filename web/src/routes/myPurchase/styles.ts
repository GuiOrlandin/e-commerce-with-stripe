import styled from "styled-components";

export const MyPurchasesProductsContainer = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(116, 98, 186, 0.3) transparent;
  gap: 1rem;

  h1 {
    margin-top: 5rem;
    font-size: 1.5rem;
  }
`;
