import styled, { css } from "styled-components";

export const ProductsContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.5rem 4rem;
  box-shadow: 0 20px 60px rgba(116, 98, 186, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
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

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  > p {
    font-size: 1rem;
    color: #6b7280;
    margin: 0 0 2rem 0;
    font-weight: 400;
  }
`;

export const ProductForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ProductImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const ImageUploadButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
  border: 2px dashed rgba(116, 98, 186, 0.3);
  border-radius: 12px;
  background: rgb(245, 243, 255);
  cursor: pointer;
  color: #7462ba;
  gap: 1rem;
  padding: 2rem;

  &:hover {
    border-color: #7462ba;
    background: rgb(250, 249, 255);
  }

  span {
    font-weight: 500;
    font-size: 1rem;
  }

  small {
    font-size: 0.875rem;
    color: #9ca3af;
  }
`;

export const ProductImagePreview = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

export const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #7462ba;
  letter-spacing: 0.3px;

  span {
    color: #ef4444;
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
`;

export const Input = styled.input`
  ${inputStyles}
`;

export const TextArea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 100px;
`;

export const SubmitButton = styled.button`
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
  margin-top: 1rem;

  &:hover {
    box-shadow: 0 6px 20px rgba(116, 98, 186, 0.4);
    background: linear-gradient(135deg, #5e4a9e 0%, #7462ba 100%);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SuccessMessage = styled.div`
  padding: 1rem;
  background: rgba(34, 197, 94, 0.1);
  border-left: 4px solid #22c55e;
  border-radius: 8px;
  color: #15803d;
  font-weight: 500;
`;

export const ErrorMessage = styled.div`
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-left: 4px solid #ef4444;
  border-radius: 8px;
  color: #dc2626;
  font-weight: 500;
`;
