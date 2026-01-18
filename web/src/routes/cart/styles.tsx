import styled, { css } from "styled-components";

export const CartContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 2rem;
`;

export const ProductsAndTotalValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
`;

export const CartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const ProductsInCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(245, 243, 255);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(116, 98, 186, 0.3);
    border-radius: 10px;

    &:hover {
      background: rgba(116, 98, 186, 0.5);
    }
  }

  h2 {
    text-align: center;
    margin: 4rem 0;
    font-size: 1.5rem;
    color: #6b7280;
    font-weight: 500;
  }
`;

export const TotalValueCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(116, 98, 186, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  border-radius: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #7462ba 0%, #5e4a9e 50%, #7462ba 100%);
  }
`;

export const TotalValueAndConfirmPaymentButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TotalValueInformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  span {
    font-size: 1rem;
    font-weight: 500;
    color: #6b7280;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const buttonBaseStyles = css`
  border-radius: 12px;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(116, 98, 186, 0.3);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(116, 98, 186, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ConfirmPaymentButton = styled.button`
  ${buttonBaseStyles}
  background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }

  &:hover {
    background: linear-gradient(135deg, #5e4a9e 0%, #7462ba 100%);
  }
`;
