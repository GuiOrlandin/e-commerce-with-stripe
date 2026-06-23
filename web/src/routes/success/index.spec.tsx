import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Home from "../home";
import Success from ".";
import { userStore } from "../../store/userStore";
import MyPurchases from "../myPurchase";

const mock = new MockAdapter(axios);

const formattedToday = format(new Date(), "d 'de' MMMM", { locale: ptBR });

function renderComponent() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/success"]}>
        <Routes>
          <Route path="/success" element={<Success />} />
          <Route path="/" element={<Home />} />
          <Route path="/my_purchases" element={<MyPurchases />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Success page", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();
    mock.resetHistory();

    userStore.setState({
      user: {
        id: "1",
        name: "Guilherme",
        email: "guilherme@example.com",
        adress: "Rua Exemplo, 123",
        number: "123",
        phone_number: "43984858757",
        profile_picture: "",
        role: "USER",
        token: "jwtToken",
        purchasedProducts: [
          {
            amount_total: 2000,
            id: "123",
            description: "description",
            name: "dog",
            image_url: "12345.jpg",
            unit_amount: 2000,
            quantity: 1,
            created_at: new Date(),
            stock: 3,
            adress: {
              city: "cidade",
              country: "string",
              adress: "Rua Exemplo",
              numberAndNeighborhood: "123, Neighborhood",
              postalCode: "1234567",
            },
          },
        ],
      },
      setUser: jest.fn(),
    });
  });

  it("Should render success page.", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Compra efetuada!")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Obrigado pela sua compra! Seu pedido será processado em breve."
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId("see-purchases")).toBeInTheDocument();
      expect(screen.getByTestId("home-page-button")).toBeInTheDocument();
    });
  });

  it("Should redirect to the home page after press Continuar Comprando button.", async () => {
    renderComponent();

    const homeButton = screen.getByTestId("home-page-button");
    await userEvent.click(homeButton);

    await waitFor(() => {
      expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });
  });

  it("Should redirect to the cart page after press Ver pedidos button.", async () => {
    renderComponent();

    const cartButton = screen.getByTestId("see-purchases");
    await userEvent.click(cartButton);

    await waitFor(() => {
      expect(screen.getByText(formattedToday)).toBeInTheDocument();
      expect(screen.getByText("Quantidade: 1")).toBeInTheDocument();
      expect(screen.getByText(/R\$\s*20/)).toBeInTheDocument();
    });
  });
});
