import * as Dialog from "@radix-ui/react-dialog";
import styled, { css } from "styled-components";

export const DeleteButton = styled.button`
  background: none;
  color: var(--color-primary);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    border: 1px solid var(--color-primary);
    background: var(--color-primary-light);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-primary-border);
  }
`;

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
`;

export const DialogDeleteCommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

export const DialogClose = styled(Dialog.Close)`
  border: none;
  margin: -1rem 0 1rem 12rem;
`;

export const Content = styled(Dialog.Content)`
  flex-direction: column;
  min-width: 400px;
  max-width: 90vw;
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  z-index: 1000;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 50%, #ef4444 100%);
  }
`;

const buttonBaseStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-border);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled(Dialog.Close)`
  ${buttonBaseStyles}
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.2);

  &:hover {
    background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
    box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
  }
`;

export const ButtonsOfDialogContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  width: 100%;
`;

export const DialogTitle = styled(Dialog.Title)`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

export const DialogTrigger = styled(Dialog.Trigger)`
  display: flex;
`;

export const DialogDeleteTriggerButton = styled.button`
  border: none;
  font-size: 0.7rem;
  font-weight: 700;
  background: none;
`;

export const ConfirmButton = styled.button`
  ${buttonBaseStyles}
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3),
      0 4px 12px rgba(239, 68, 68, 0.4);
  }
`;
