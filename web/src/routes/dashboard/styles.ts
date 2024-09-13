import styled from "styled-components";

export const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #f1f1f1;
  padding: 2.3rem;
`;

export const ContentContainer = styled.div`
  display: flex;
  width: 100vw;

  flex-direction: column;
  padding-left: 1rem;
  gap: 3rem;
`;

export const SoldItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding: 1rem;
  height: 38rem;
  width: 70%;
  gap: 2rem;
  background: white;
  overflow: scroll;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;
export const SoldItemsAndChartContainer = styled.div`
  display: flex;
  gap: 2rem;
`;

export const ChartContainer = styled.div`
  display: flex;
  height: 38rem;
  flex: 1;
  border-radius: 5px;
  background: white;
`;

export const DateContainer = styled.p`
  display: flex;

  padding-bottom: 0.2rem;
  margin-bottom: 0.7rem;
  border-bottom: 1px solid #ededed;
  font-weight: 500;
`;
export const NameAndQuantityContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export const ImageNameAndEmailCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  img {
    width: 5rem;
    height: 5rem;
    border-radius: 8px;
  }
`;
export const ImageAndNameContainer = styled.div`
  display: flex;
  gap: 2rem;
`;

export const CardOfSoldItemContainer = styled.div`
  display: flex;
  flex-direction: column;

  p {
    font-weight: 600;
  }
`;
export const TotalIncomeValueContainer = styled.div`
  display: flex;
  border-radius: 8px;
  flex-direction: column;
  height: 9rem;
  width: 18rem;
  border-radius: 5px;
  padding: 1rem;
  background: white;

  h2 {
    font-weight: 500;
  }

  span {
    font-size: 1.5rem;
    font-weight: 700;
  }
`;
