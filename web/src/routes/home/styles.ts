import styled from "styled-components";

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  width: 100%;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-muted);
    margin: 0;
  }
`;

export const ProductCartContainer = styled.div`
  display: flex;
  gap: var(--space-5);
  flex-wrap: wrap;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  h2 {
    text-align: center;
    margin: 4rem 0 0 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-muted);
    width: 100%;
  }
`;
