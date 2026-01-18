import { BarChart } from "@mui/x-charts/BarChart";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useDashboardFetch } from "../../hooks/useDashboardInfoFetch";
import { userStore } from "../../store/userStore";
import {
  CardOfSoldItemContainer,
  ChartContainer,
  ContentContainer,
  DashboardHeader,
  DateContainer,
  ImageAndNameContainer,
  ImageNameAndEmailCardContainer,
  NameAndQuantityContainer,
  SoldItemsAndChartContainer,
  SoldItemsContainer,
  TotalIncomeValueContainer,
} from "./styles";

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

  console.log(data);

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
    <ContentContainer>
      <DashboardHeader>
        <TotalIncomeValueContainer>
          <h2>Rendimento Total</h2>
          <span>
            {data
              ? data!
                  .filter((monthData) => monthData.month === currentMonthName)
                  .map((monthFiltered) =>
                    (monthFiltered.totalIncome / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })
                  )
              : "R$ 0,00"}
          </span>
          <p>
            {Number(salesPercentageComparedToLastMonth) >= 0 && Number(salesPercentageComparedToLastMonth) !== Infinity
              ? `${Math.round(Number(salesPercentageComparedToLastMonth)) > 0 ? "+" : ""}${Math.round(Number(salesPercentageComparedToLastMonth))}%`
              : "sem valores do ultimo mês"}
            {Number(salesPercentageComparedToLastMonth) >= 0 && Number(salesPercentageComparedToLastMonth) !== Infinity ? " a mais que o mês passado" : ""}
          </p>
        </TotalIncomeValueContainer>
      </DashboardHeader>
      <SoldItemsAndChartContainer>
          <ChartContainer>
            <h2>Vendas por Mês</h2>
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
                  color: "#7462ba",
                },
              ]}
              width={600}
              height={450}
              margin={{ left: 80, top: 20, right: 20, bottom: 60 }}
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

                      <p>
                        {(soldProductsData.amount_total / 100).toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 2,
                          }
                        )}
                      </p>
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
  );
}
