import styled from "styled-components";

export const PurchaseCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
`;

export const PurchaseDataContainer = styled.div`
  display: flex;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text);
`;

export const PurchaseCardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export const ImageQuantityTotalValueAndAdressContainer = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 10rem;
    height: auto;
    border-radius: var(--radius-sm);
    margin-right: 1.5rem;
    object-fit: cover;
  }

  p {
    margin: 0;
    font-weight: 600;
    color: var(--color-text);
  }

  span {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }
`;

export const QuantityTotalValueContainer = styled.div`
  display: flex;
  flex-direction: column;

  p {
    margin-bottom: 0.3rem;
  }
`;

export const StatusOfProduct = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-primary-light);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  margin-right: 3rem;
  border: 1px solid var(--color-primary-border);

  p {
    font-weight: 600;
    color: var(--color-primary);
    margin: 0 0 0.25rem 0;
    font-size: 0.875rem;
  }

  span {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }
`;
