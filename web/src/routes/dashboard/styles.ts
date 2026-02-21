import styled from "styled-components";

export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 2rem;
`;

export const DashboardHeader = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  flex-wrap: wrap;
`;

export const TotalIncomeValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  min-width: 300px;
  flex: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-hover) 50%, var(--color-primary) 100%);
  }

  h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-muted);
    margin: 0 0 0.75rem 0;
    letter-spacing: 0.3px;
  }

  span {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin: 0;
    font-weight: 500;

    &::before {
      content: "📈 ";
    }
  }
`;

export const SoldItemsAndChartContainer = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 500px;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-hover) 50%, var(--color-primary) 100%);
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1.5rem 0;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }

  > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    overflow-x: auto;
  }

  svg {
    max-width: 100%;
    height: auto;
  }
`;

export const SoldItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  padding: 2rem;
  min-height: 500px;
  max-height: 600px;
  width: 100%;
  max-width: 500px;
  gap: 1.5rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-hover) 50%, var(--color-primary) 100%);
  }

  scrollbar-width: thin;
  scrollbar-color: var(--color-primary-border) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-primary-border);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary-muted);
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }

  > h1:last-child {
    margin-top: 3rem;
    color: var(--color-text-subtle);
    -webkit-text-fill-color: var(--color-text-subtle);
    font-weight: 500;
    text-align: center;
  }
`;

export const CardOfSoldItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: var(--color-surface-alt);
  border-radius: var(--radius-md);
  border: 2px solid var(--color-primary-light);
  transition: all 0.2s ease;
  gap: 1rem;

  &:hover {
    border-color: var(--color-primary-border);
    box-shadow: 0 4px 12px var(--color-primary-muted);
    transform: translateY(-2px);
  }

  p {
    font-weight: 600;
    color: var(--color-text);
  }
`;

export const DateContainer = styled.p`
  display: flex;
  padding-bottom: 0.75rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-primary-border);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-primary);
  letter-spacing: 0.3px;
`;

export const ImageNameAndEmailCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  img {
    width: 5rem;
    height: 5rem;
    object-fit: cover;
    border-radius: var(--radius-md);
    border: 2px solid var(--color-primary-light);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  > p {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    white-space: nowrap;
  }
`;

export const ImageAndNameContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex: 1;
`;

export const NameAndQuantityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  p {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
    line-height: 1.3;
  }

  span {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    font-weight: 500;
  }
`;
