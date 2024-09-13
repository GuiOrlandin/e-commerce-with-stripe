import { BarChart } from "@mui/x-charts/BarChart";
import {
  CardOfSoldItemContainer,
  ChartContainer,
  ContentContainer,
  DashboardContainer,
  DateContainer,
  ImageAndNameContainer,
  ImageNameAndEmailCardContainer,
  NameAndQuantityContainer,
  SoldItemsAndChartContainer,
  SoldItemsContainer,
  TotalIncomeValueContainer,
} from "./styles";
import SideBar from "../../components/sidebar";
import { useDashboardFetch } from "../../hooks/useDashboardInfoFetch";
import { useEffect, useState } from "react";
import { userStore } from "../../store/userStore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { data } = useDashboardFetch();
  const navigate = useNavigate();
  const [
    salesPercentageComparedToLastMonth,
    setSalesPercentageComparedToLastMonth,
  ] = useState<Number | undefined>();
  const userInfo = userStore((state) => state.user);
  const currentMonthName = format(new Date(), "MMMM", { locale: ptBR });

  useEffect(() => {
    if (!userInfo.token) {
      navigate("/");
    }

    if (data && data!.length > 0) {
      const currentMonthData = data.find(
        (monthData) => monthData.month === currentMonthName
      );

      const currentMonthIndex = data.findIndex(
        (monthData) => monthData === currentMonthData
      );

      if (data[currentMonthIndex + 1] && data[currentMonthIndex]) {
        const lastMonthTotalIncome =
          data[currentMonthIndex + 1].totalIncome / 100;
        const currentMonthTotalIncome =
          data[currentMonthIndex].totalIncome / 100;

        setSalesPercentageComparedToLastMonth(
          ((currentMonthTotalIncome - lastMonthTotalIncome) /
            lastMonthTotalIncome) *
            100
        );
      }
    }
  }, [userInfo, data]);

  return (
    <DashboardContainer>
      <SideBar />
      <ContentContainer>
        <TotalIncomeValueContainer>
          <h2>Rendimento Total</h2>
          <span>
            R${" "}
            {data
              ? data!
                  .filter((monthData) => monthData.month === currentMonthName)
                  .map((monthFiltered) => monthFiltered.totalIncome / 100)
              : []}
          </span>
          <p>
            {salesPercentageComparedToLastMonth
              ? `${salesPercentageComparedToLastMonth!.toString()}% `
              : "sem valores do ultimo mês"}
            a mais que o mês passado
          </p>
        </TotalIncomeValueContainer>
        <SoldItemsAndChartContainer>
          <ChartContainer>
            <BarChart
              xAxis={[
                {
                  id: "barCategories",
                  data: data ? data!.map((MonthData) => MonthData.month) : [],
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
                  data: data
                    ? data!.map((MonthData) => MonthData.totalIncome / 100)
                    : [],
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
            {data ? (
              data.map((dataMonth) =>
                dataMonth.soldProducts.map((soldProductsData) => (
                  <CardOfSoldItemContainer key={soldProductsData.purchase_id}>
                    <DateContainer>
                      {new Date(
                        soldProductsData!.created_at!
                      ).toLocaleDateString("pt-BR")}
                    </DateContainer>
                    <ImageNameAndEmailCardContainer>
                      <ImageAndNameContainer>
                        <img
                          src={`http://localhost:3333/files/${soldProductsData.image_url}`}
                          alt=""
                        />
                        <NameAndQuantityContainer>
                          <p>{soldProductsData.name}</p>
                          <span>Quantidade: {soldProductsData.quantity}</span>
                        </NameAndQuantityContainer>
                      </ImageAndNameContainer>

                      <p>R$ {soldProductsData.amount_total / 100}</p>
                    </ImageNameAndEmailCardContainer>
                  </CardOfSoldItemContainer>
                ))
              )
            ) : (
              <h1>Sem nenhuma venda!</h1>
            )}
          </SoldItemsContainer>
        </SoldItemsAndChartContainer>
      </ContentContainer>
    </DashboardContainer>
  );
}
