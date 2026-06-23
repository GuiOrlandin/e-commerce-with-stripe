import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Dashboard from "./index";
import Home from "../home";
import { userStore } from "../../store/userStore";

const mock = new MockAdapter(axios);
const currentMonthName = format(new Date(), "MMMM", { locale: ptBR });

function renderComponent() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Dashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();

    userStore.setState({
      user: {
        id: "1",
        name: "Guilherme",
        email: "guilherme@example.com",
        adress: "Rua Exemplo, 123",
        number: "123",
        phone_number: "43984858757",
        profile_picture: "",
        role: "ADMIN",
        token: "jwtToken",
        purchasedProducts: [],
      },
      setUser: jest.fn(),
    });
  });

  it("should render the dashboard with information", async () => {
    mock.onGet("http://localhost:3333/user/dashboard").reply(
      200,
      [
        {
          month: currentMonthName,
          soldProducts: [
            {
              amount_total: 2000,
              id: "66be4c661a8a378d86e155e2",
              purchase_id: "li_1PxcxUHMaVr09kGID9RSArOR",
              description:
                "Um cachorro legal denmais para adoção, eu adotaria muito!",
              name: "Pug",
              unit_amount: 2000,
              quantity: 1,
              created_at: "2024-09-10T22:55:13.225Z",
              status: "paymentWasSuccessful",
              adress: {
                city: "Américo Brasiliense",
                country: "BR",
                adress: "Rua Santa Ernestina",
                numberAndNeighborhood: "70, Jardim Vista Alegre",
                postalCode: "14820-714",
              },
              image_url: "1723747430288-925904753.jpg",
            },
            {
              amount_total: 2000,
              id: "66c4f4f2e599a2ac2f679dd5",
              purchase_id: "li_1PxcxUHMaVr09kGIGDo6xZcc",
              description: "Um cachorro legal",
              name: "Cachorro",
              unit_amount: 2000,
              quantity: 1,
              created_at: "2024-09-10T22:55:13.225Z",
              status: "paymentWasSuccessful",
              adress: {
                city: "Américo Brasiliense",
                country: "BR",
                adress: "Rua Santa Ernestina",
                numberAndNeighborhood: "70, Jardim Vista Alegre",
                postalCode: "14820-714",
              },
              image_url: "1724183793999-502100033.jpg",
            },
          ],
          totalIncome: 4000,
        },
      ],
      {
        headers: {
          Authorization: `Bearer jwtToken`,
        },
      }
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Pug")).toBeInTheDocument();
      expect(screen.getByText("Cachorro")).toBeInTheDocument();
      expect(screen.getAllByText(/R\$\s*40/).length).toBeGreaterThan(0);
      expect(screen.getByText("Rendimento Total")).toBeInTheDocument();
    });
  });
});
