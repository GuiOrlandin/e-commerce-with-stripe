import styled from "styled-components";

export const PurchaseCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

export const PurchaseDataContainer = styled.div`
  display: flex;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ededed;
  font-size: 1.2rem;
  font-weight: 700;
  color: #333333;
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
    border-radius: 8px;
    margin-right: 1.5rem;
    object-fit: cover;
  }

  p {
    margin: 0;
    font-weight: 600;
    color: #333333;
  }

  span {
    color: #666666;
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
  background-color: #e8f5e9;
  padding: 0.75rem;
  border-radius: 8px;
  margin-right: 3rem;

  p {
    font-weight: 600;
    color: #388e3c;
    margin: 0;
  }

  span {
    font-size: 1rem;
    color: #2e7d32;
  }
`;
