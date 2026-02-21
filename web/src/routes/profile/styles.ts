import styled, { css } from "styled-components";
import InputMask from "react-input-mask";

export const ProfileContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const SideBar = styled.div`
  width: 250px;
  background: #ffffff;
`;

export const ContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  width: 100%;
`;

export const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 3.5rem 4rem;
  width: 100%;
  max-width: 700px;
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-lg);
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
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
`;

export const ProfileTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
  text-align: center;
`;

export const ProfileSubtitle = styled.p`
  font-size: 1rem;
  color: var(--color-text-muted);
  margin: 0 0 2rem 0;
  text-align: center;
  font-weight: 400;
`;

export const AvatarImageContainer = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 2rem;

  button {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    border: none;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-error-hover);
      transform: scale(1.1);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
    }
  }
`;

export const AvatarWithoutImageContainer = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 2rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  svg[role="img"] {
    border-radius: 50%;
    border: 4px solid var(--color-primary-light);
    box-shadow: 0 4px 16px var(--color-primary-muted);
  }

  button {
    position: absolute;
    bottom: 0;
    right: calc(50% - 75px);
    border: none;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
    color: white;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px var(--color-primary-border);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px var(--color-text-subtle);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px var(--color-primary-border);
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

export const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-primary-light);
  box-shadow: 0 4px 16px var(--color-primary-muted);
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;

  ${InfoContainer} {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
    ${InfoContainer} {
      margin-bottom: 1.5rem;
    }
    ${InfoContainer}:last-child {
      margin-bottom: 0;
    }
  }
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
  letter-spacing: 0.3px;
`;

export const Info = styled.p`
  font-size: 1rem;
  color: var(--color-text);
  margin: 0;
  padding: 0.75rem 1rem;
  background: var(--color-surface-alt);
  border-radius: 12px;
  border: 2px solid var(--color-primary-light);
  min-height: 1.5rem;
  word-break: break-word;
`;

const inputStyles = css`
  border-radius: 12px;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  background: var(--color-surface-alt);
  color: var(--color-primary);
  border: 2px solid var(--color-primary-border);
  width: 100%;
  font-weight: 500;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    background: var(--color-surface);
    box-shadow: 0 0 0 4px var(--color-primary-light);
  }

  &:hover:not(:focus) {
    border-color: var(--color-primary-border);
    background: var(--color-surface-alt);
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
    -webkit-text-fill-color: var(--color-primary) !important;
    transition: background-color 5000s ease-in-out 0s;
    border-color: var(--color-primary-border);
  }
`;

export const ProfileInput = styled.input`
  ${inputStyles}
`;

export const ProfileInputMask = styled(InputMask)`
  ${inputStyles}
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  margin-top: 1.5rem;
`;

export const EditButton = styled.button`
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
  box-shadow: 0 4px 12px var(--color-primary-border);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%);
    box-shadow: 0 6px 20px var(--color-primary-border);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-border),
      0 4px 12px var(--color-primary-border);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  border-radius: 12px;
  border: 2px solid var(--color-primary-border);
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary);
  background: transparent;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-primary-light);
    border-color: var(--color-primary);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-border);
  }
`;
