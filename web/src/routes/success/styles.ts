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
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  padding: 2.5rem 3rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  text-align: center;
  max-width: 480px;
  position: relative;
  overflow: hidden;
  gap: 1rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-primary);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 1rem 0 0 0;
    color: var(--color-text);
    letter-spacing: 0.01em;
  }

  @media (max-width: 768px) {
    padding: 2rem;
    max-width: 95%;

    h1 {
      font-size: 1.5rem;
    }
  }
`;

export const SuccessIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  flex-shrink: 0;

  svg {
    width: 48px;
    height: 48px;
  }
`;

export const SuccessMessage = styled.p`
  margin: 0.5rem 0 1.5rem 0;
  font-size: 1rem;
  color: var(--color-text-muted);
  font-weight: 400;
  line-height: 1.6;
  max-width: 400px;
`;

export const SuccessButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  max-width: 280px;
  transition: all 0.2s ease;

  &:first-of-type {
    background: var(--color-primary);
    color: white;
    box-shadow: var(--shadow-sm);

    &:hover {
      background: var(--color-primary-hover);
      box-shadow: var(--shadow-md);
    }

    &:focus {
      outline: none;
      box-shadow: var(--shadow-focus);
    }
  }

  &:last-of-type {
    background: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary-border);

    &:hover {
      background: var(--color-primary-light);
      border-color: var(--color-primary);
    }

    &:focus {
      outline: none;
      box-shadow: var(--shadow-focus);
    }
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;
