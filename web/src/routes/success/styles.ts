import styled from "styled-components";

export const SuccessContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f1f1f1;
  height: 100vh;
  width: 100vw;
  padding: 2.3rem;
`;

export const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: white;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
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
