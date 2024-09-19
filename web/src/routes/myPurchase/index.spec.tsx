import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { userStore } from "../../store/userStore";
import MyPurchases from ".";

let mock = new MockAdapter(axios);

function renderComponent() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <MyPurchases />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("My purchases component", () => {
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

  it("should render the page with de component", async () => {
    renderComponent();
    screen.debug();

    await waitFor(() => {
      expect(screen.getByText("Quantidade:", { exact: false }));
      expect(screen.getByText("Rua Exemplo, 123.", { exact: false }));
      expect(screen.getByText("Valor total: R$", { exact: false }));
      expect(screen.getByText("Pagamento concluido!", { exact: false }));
    });
  });
  it("should not render the component with empty purchasedProducts", async () => {
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
        purchasedProducts: [],
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Nenhum produto comprado!"));
    });
  });
});
