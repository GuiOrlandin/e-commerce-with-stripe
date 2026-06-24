import styled from "styled-components";

export const ChatPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  gap: 1rem;
`;

export const ChatHeader = styled.div`
  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    color: var(--color-text);
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.95rem;
  }
`;

export const MessagesArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-height: 400px;
  max-height: calc(100vh - 320px);
  overflow-y: auto;
  padding: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

export const MessageBubble = styled.div<{ $role: "user" | "assistant" }>`
  align-self: ${({ $role }) => ($role === "user" ? "flex-end" : "flex-start")};
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  background: ${({ $role }) =>
    $role === "user" ? "var(--color-primary)" : "var(--color-surface-alt)"};
  color: ${({ $role }) => ($role === "user" ? "#fff" : "var(--color-text)")};
  line-height: 1.5;
  white-space: pre-wrap;
`;

export const ProductsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const ProductCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);

  img {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    flex-shrink: 0;
  }
`;

export const ProductInfo = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
    color: var(--color-text);
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--color-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-primary);
  }
`;

export const ProductActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
`;

export const AddToCartButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--color-primary-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GoToCartLink = styled.a`
  display: inline-flex;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const InputArea = styled.form`
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
`;

export const MessageInput = styled.textarea`
  flex: 1;
  min-height: 48px;
  max-height: 120px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  background: var(--color-surface);
  color: var(--color-text);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: var(--shadow-focus);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  align-self: flex-end;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--color-primary-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  margin: 0;
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.08);
  color: var(--color-error);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
`;

export const EmptyState = styled.p`
  margin: auto;
  color: var(--color-text-muted);
  text-align: center;
  font-size: 0.95rem;
`;
