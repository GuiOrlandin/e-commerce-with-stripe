import styled from "styled-components";

export const MyPurchasesProductsContainer = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  width: 100%;
  border-radius: var(--radius-sm);
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary-border) transparent;
  gap: var(--space-4);

  h1 {
    margin-top: 4rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-muted);
  }
`;
