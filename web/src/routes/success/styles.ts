import styled from "styled-components";

export const SuccessContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 60vh;
`;

export const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: white;
  padding: 3rem 4rem;
  box-shadow: 0 20px 60px rgba(116, 98, 186, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 500px;
`;

export const SuccessMessage = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #555;
`;

export const SuccessButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #4CC760;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: green;
  }

  &:first-of-type {
    margin-right: 0.5rem;
  }
`;
