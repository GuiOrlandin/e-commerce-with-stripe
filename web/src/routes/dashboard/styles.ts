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
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(116, 98, 186, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
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
    background: linear-gradient(90deg, #7462ba 0%, #5e4a9e 50%, #7462ba 100%);
  }

  h2 {
    font-size: 1rem;
    font-weight: 600;
    color: #6b7280;
    margin: 0 0 0.75rem 0;
    letter-spacing: 0.3px;
  }

  span {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.875rem;
    color: #6b7280;
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
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(116, 98, 186, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
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
    background: linear-gradient(90deg, #7462ba 0%, #5e4a9e 50%, #7462ba 100%);
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1.5rem 0;
    background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
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
  border-radius: 20px;
  padding: 2rem;
  min-height: 500px;
  max-height: 600px;
  width: 100%;
  max-width: 500px;
  gap: 1.5rem;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(116, 98, 186, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
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
    background: linear-gradient(90deg, #7462ba 0%, #5e4a9e 50%, #7462ba 100%);
  }

  scrollbar-width: thin;
  scrollbar-color: rgba(116, 98, 186, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(116, 98, 186, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(116, 98, 186, 0.5);
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }

  > h1:last-child {
    margin-top: 3rem;
    color: #9ca3af;
    -webkit-text-fill-color: #9ca3af;
    font-weight: 500;
    text-align: center;
  }
`;

export const CardOfSoldItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: rgb(245, 243, 255);
  border-radius: 12px;
  border: 2px solid rgba(116, 98, 186, 0.1);
  transition: all 0.2s ease;
  gap: 1rem;

  &:hover {
    border-color: rgba(116, 98, 186, 0.3);
    box-shadow: 0 4px 12px rgba(116, 98, 186, 0.15);
    transform: translateY(-2px);
  }

  p {
    font-weight: 600;
    color: #1f2937;
  }
`;

export const DateContainer = styled.p`
  display: flex;
  padding-bottom: 0.75rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid rgba(116, 98, 186, 0.2);
  font-weight: 600;
  font-size: 0.875rem;
  color: #7462ba;
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
    border-radius: 12px;
    border: 2px solid rgba(116, 98, 186, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  > p {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, #7462ba 0%, #5e4a9e 100%);
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
    color: #1f2937;
    margin: 0;
    line-height: 1.3;
  }

  span {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }
`;
