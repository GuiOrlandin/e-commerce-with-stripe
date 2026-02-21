import styled, { css } from "styled-components";

export const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-bg);
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

export const RegisterContent = styled.div`
  display: flex;
  padding: 3.5rem 4rem;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
  background: var(--color-surface);
  width: 42rem;
  max-width: 90vw;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-primary);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }
`;

export const RegisterTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
  text-align: center;
`;

export const RegisterSubtitle = styled.p`
  font-size: 1rem;
  color: var(--color-text-muted);
  margin: 0 0 2.5rem 0;
  text-align: center;
  font-weight: 400;
`;

export const NameInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;

  span {
    margin-bottom: 0.5rem;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    letter-spacing: 0.01em;
  }
`;

const inputStyles = css`
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: var(--color-surface-alt);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  width: 100%;
  font-weight: 500;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: var(--shadow-focus);
  }

  &:hover:not(:focus) {
    border-color: var(--color-text-subtle);
  }

  &::placeholder {
    color: var(--color-text-subtle);
    font-weight: 400;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px var(--color-surface-alt) inset !important;
    -webkit-text-fill-color: var(--color-text) !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

export const NameInput = styled.input`
  ${inputStyles}
`;

const buttonBaseStyles = css`
  border-radius: var(--radius-md);
  border: none;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  position: relative;
  letter-spacing: 0.01em;
  box-shadow: var(--shadow-sm);
  transition: background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const RegisterButton = styled.button`
  ${buttonBaseStyles}
  margin-top: 2rem;
  background: var(--color-primary);

  &:hover {
    background: var(--color-primary-hover);
  }
`;
