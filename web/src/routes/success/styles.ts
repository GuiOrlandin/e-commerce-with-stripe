import styled from "styled-components";

export const SuccessContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-height: 70vh;
`;

export const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: #ffffff;
  padding: 3.5rem 4rem;
  box-shadow: 0 20px 60px rgba(116, 98, 186, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 550px;
  position: relative;
  overflow: hidden;
  gap: 1rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #7462ba 0%, #5e4a9e 50%, #7462ba 100%);
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 1rem 0 0 0;
    background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    padding: 2.5rem 2rem;
    max-width: 95%;

    h1 {
      font-size: 1.75rem;
    }
  }
`;

export const SuccessIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(116, 98, 186, 0.1) 0%, rgba(94, 74, 158, 0.05) 100%);
  box-shadow: 0 8px 24px rgba(116, 98, 186, 0.2);
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 8px 24px rgba(116, 98, 186, 0.2);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 12px 32px rgba(116, 98, 186, 0.3);
    }
  }

  svg {
    filter: drop-shadow(0 4px 8px rgba(116, 98, 186, 0.2));
  }
`;

export const SuccessMessage = styled.p`
  margin: 0.5rem 0 1.5rem 0;
  font-size: 1.1rem;
  color: #6b7280;
  font-weight: 400;
  line-height: 1.6;
  max-width: 450px;
`;

export const SuccessButton = styled.button`
  margin-top: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  width: 100%;
  max-width: 300px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:first-of-type {
    background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(116, 98, 186, 0.3);

    &:hover {
      background: linear-gradient(135deg, #5e4a9e 0%, #7462ba 100%);
      box-shadow: 0 6px 20px rgba(116, 98, 186, 0.4);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(116, 98, 186, 0.3),
        0 4px 12px rgba(116, 98, 186, 0.3);
    }
  }

  &:last-of-type {
    background: transparent;
    color: #7462ba;
    border: 2px solid rgba(116, 98, 186, 0.3);

    &:hover {
      background: rgba(116, 98, 186, 0.1);
      border-color: #7462ba;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(116, 98, 186, 0.2);
    }
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;
