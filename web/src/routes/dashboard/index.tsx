import { BarChart } from "@mui/x-charts/BarChart";
import {
  CardOfSoldItemContainer,
  ChartContainer,
  ContentContainer,
  DashboardContainer,
  DateContainer,
  ImageAndNameContainer,
  ImageNameAndEmailCardContainer,
  NameAndEmailContainer,
  SoldItemsAndChartContainer,
  SoldItemsContainer,
  TotalIncomeValueContainer,
} from "./styles";
import SideBar from "../../components/sidebar";

export default function Dashboard() {
  return (
    <DashboardContainer>
      <SideBar />
      <ContentContainer>
        <TotalIncomeValueContainer>
          <h2>Rendimento Total</h2>
          <span>R$ 10.000</span>
          <p>10% a mais que o mês passado</p>
        </TotalIncomeValueContainer>
        <SoldItemsAndChartContainer>
          <ChartContainer>
            <BarChart
              xAxis={[
                {
                  id: "barCategories",
                  data: [
                    "Janeiro",
                    "Fevereiro",
                    "Março",
                    "Abril",
                    "Maio",
                    "Junho",
                  ],
                  scaleType: "band",
                  disableLine: true,
                  disableTicks: true,
                },
              ]}
              yAxis={[
                {
                  disableLine: true,
                  disableTicks: true,
                  valueFormatter: (value) => `R$${value}`,
                },
              ]}
              series={[
                {
                  data: [10000, 5000, 3000, 6000, 1000, 9000],
                  color: "#2906b1",
                },
              ]}
              width={650}
              height={600}
              margin={{ left: 80 }}
            />
          </ChartContainer>
          <SoldItemsContainer>
            <h1>Vendas Recentes</h1>
            <CardOfSoldItemContainer>
              <DateContainer>10 de setembro</DateContainer>
              <ImageNameAndEmailCardContainer>
                <ImageAndNameContainer>
                  <img
                    src={`http://localhost:3333/files/1723589429376-211359154.jpg`}
                    alt=""
                  />
                  <NameAndEmailContainer>
                    <p>Guilherme Orlandin</p>
                    <span>guiorlandin@gmail.com</span>
                  </NameAndEmailContainer>
                </ImageAndNameContainer>

                <p>R$ 300</p>
              </ImageNameAndEmailCardContainer>
            </CardOfSoldItemContainer>
            <CardOfSoldItemContainer>
              <DateContainer>10 de setembro</DateContainer>
              <ImageNameAndEmailCardContainer>
                <ImageAndNameContainer>
                  <img
                    src={`http://localhost:3333/files/1723589429376-211359154.jpg`}
                    alt=""
                  />
                  <NameAndEmailContainer>
                    <p>Guilherme Orlandin</p>
                    <span>guiorlandin@gmail.com</span>
                  </NameAndEmailContainer>
                </ImageAndNameContainer>

                <p>R$ 300</p>
              </ImageNameAndEmailCardContainer>
            </CardOfSoldItemContainer>
            <CardOfSoldItemContainer>
              <DateContainer>10 de setembro</DateContainer>
              <ImageNameAndEmailCardContainer>
                <ImageAndNameContainer>
                  <img
                    src={`http://localhost:3333/files/1723589429376-211359154.jpg`}
                    alt=""
                  />
                  <NameAndEmailContainer>
                    <p>Guilherme Orlandin</p>
                    <span>guiorlandin@gmail.com</span>
                  </NameAndEmailContainer>
                </ImageAndNameContainer>

                <p>R$ 300</p>
              </ImageNameAndEmailCardContainer>
            </CardOfSoldItemContainer>
          </SoldItemsContainer>
        </SoldItemsAndChartContainer>
      </ContentContainer>
    </DashboardContainer>
  );
}
