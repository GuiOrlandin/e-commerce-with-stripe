import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f1f1f1;
  height: 100vh;
  width: 100vw;
  padding: 2.3rem;
  position: relative;
`;

export const SideBarContainer = styled.div`
  position: absolute;
  left: 2.3rem;
  top: 2.3rem;
  bottom: 0;
`;

export const LoginContent = styled.div`
  display: flex;
  padding: 3rem;
  flex-direction: column;
  background: #f8f7f7;
  width: 40rem;
  border-radius: 8px;
`;

export const EmailInputContainer = styled.div`
  display: flex;
  flex-direction: column;

  font-size: 1.3rem;
  font-weight: 500;

  span {
    margin-bottom: 0.3rem;
  }
`;
export const ErrorMessageContainer = styled.div`
  color: red;
  position: absolute;
  margin-top: 5.3rem;

  font-size: 1rem;
`;

export const PasswordInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;

  font-size: 1.3rem;
  font-weight: 500;

  span {
    margin-bottom: 0.3rem;
  }
`;
export const EmailInput = styled.input`
  border-radius: 5px;
  border: 1px solid #7462ba;
  padding: 1rem;
`;
export const PasswordInput = styled.input`
  border-radius: 5px;
  border: 1px solid #7462ba;
  padding: 1rem;
  position: relative;
`;
export const LoginButton = styled.button`
  border-radius: 5px;
  background: #7462ba;
  border: none;

  margin-top: 2rem;

  color: white;
  font-weight: 500;

  &:hover {
    background: #b9b1d6;
  }
`;

export const RegisterButton = styled.button`
  border-radius: 5px;
  background: #7462ba;
  border: none;

  margin-top: 1rem;

  color: white;
  font-weight: 500;

  &:hover {
    background: #b9b1d6;
  }
`;
