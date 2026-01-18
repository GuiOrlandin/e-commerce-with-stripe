import styled, { css } from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f8f7f7 100%);
  min-height: 100vh;
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
  padding: 3.5rem 4rem;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(116, 98, 186, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  width: 42rem;
  max-width: 90vw;
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

export const LoginTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
`;

export const LoginSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 2.5rem 0;
  text-align: center;
  font-weight: 400;
`;

export const EmailInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.1rem;
  font-weight: 600;

  span {
    margin-bottom: 0.75rem;
    color: #7462ba;
    font-size: 1rem;
    letter-spacing: 0.3px;
  }
`;

export const ErrorMessageContainer = styled.div`
  color: #ef4444;
  position: absolute;
  margin-top: 5.3rem;
  font-size: 0.9rem;
  font-weight: 500;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #ef4444;
`;

export const PasswordInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  position: relative;

  span {
    margin-bottom: 0.75rem;
    color: #7462ba;
    font-size: 1rem;
    letter-spacing: 0.3px;
  }
`;

const inputStyles = css`
  border-radius: 12px;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  background: rgb(245, 243, 255);
  color: #7462ba;
  border: 2px solid rgba(116, 98, 186, 0.2);
  width: 100%;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #7462ba;
    background: rgb(250, 249, 255);
    box-shadow: 0 0 0 4px rgba(116, 98, 186, 0.1);
  }

  &:hover:not(:focus) {
    border-color: rgba(116, 98, 186, 0.4);
    background: rgb(248, 247, 255);
  }

  &::placeholder {
    color: rgba(116, 98, 186, 0.5);
    font-weight: 400;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px rgb(245, 243, 255) inset !important;
    -webkit-text-fill-color: #7462ba !important;
    transition: background-color 5000s ease-in-out 0s;
    border-color: rgba(116, 98, 186, 0.2);
  }
`;

export const EmailInput = styled.input`
  ${inputStyles}
`;

export const PasswordInput = styled(EmailInput)`
  ${inputStyles}
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


  &:hover {
    box-shadow: 0 6px 20px rgba(116, 98, 186, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const LoginButton = styled.button`
  ${buttonBaseStyles}
  margin-top: 2.5rem;
  background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);

  &:hover {
    background: linear-gradient(135deg, #5e4a9e 0%, #7462ba 100%);
  }
`;

export const RegisterButton = styled.button`
  ${buttonBaseStyles}
  margin-top: 1rem;
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  box-shadow: 0 4px 12px rgba(167, 139, 250, 0.3);

  &:hover {
    background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
    box-shadow: 0 6px 20px rgba(167, 139, 250, 0.4);
  }
`;
