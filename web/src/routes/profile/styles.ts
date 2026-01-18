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
  box-shadow: 0 20px 60px rgba(116, 98, 186, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.08);
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

export const ProfileTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

export const ProfileSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
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
      background: #dc2626;
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
    border: 4px solid rgba(116, 98, 186, 0.1);
    box-shadow: 0 4px 16px rgba(116, 98, 186, 0.15);
  }

  button {
    position: absolute;
    bottom: 0;
    right: calc(50% - 75px);
    border: none;
    background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
    color: white;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(116, 98, 186, 0.4);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(116, 98, 186, 0.5);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(116, 98, 186, 0.3);
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
  border: 4px solid rgba(116, 98, 186, 0.1);
  box-shadow: 0 4px 16px rgba(116, 98, 186, 0.15);
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
  color: #7462ba;
  letter-spacing: 0.3px;
`;

export const Info = styled.p`
  font-size: 1rem;
  color: #1f2937;
  margin: 0;
  padding: 0.75rem 1rem;
  background: rgb(245, 243, 255);
  border-radius: 12px;
  border: 2px solid rgba(116, 98, 186, 0.1);
  min-height: 1.5rem;
  word-break: break-word;
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
  font-family: inherit;

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
  box-shadow: 0 4px 12px rgba(116, 98, 186, 0.3);
  background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #5e4a9e 0%, #7462ba 100%);
    box-shadow: 0 6px 20px rgba(116, 98, 186, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(116, 98, 186, 0.3),
      0 4px 12px rgba(116, 98, 186, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  border-radius: 12px;
  border: 2px solid rgba(116, 98, 186, 0.3);
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #7462ba;
  background: transparent;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(116, 98, 186, 0.1);
    border-color: #7462ba;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(116, 98, 186, 0.2);
  }
`;
