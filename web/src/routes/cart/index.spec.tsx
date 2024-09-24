import React from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { productStore } from "../../store/productStore";
import Cart from ".";
import userEvent from "@testing-library/user-event";

let mock = new MockAdapter(axios);

let assignMock = jest.fn();

function renderComponent() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Cart Page", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();
    mock.resetHistory();
    assignMock.mockClear();

    const checkoutUrl = "https://checkout.stripe.com/some-session-id";

    productStore.setState({
      products: [
        {
          _id: "1234",
          description: "product description",
          image_url: "12345.jpg",
          name: "Product",
          quantity: 1,
          unit_value: 20,
          stock: 3,
        },
      ],
      setProduct: jest.fn(),
    });
  });

  it("should render the page with de component", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Valor total:", { exact: false }));
      expect(screen.getByText("R$20", { exact: false }));
      expect(screen.getByText("Confirmar Pagamento"));
    });
  });
  it("should display the empty cart message when the cart is empty", async () => {
    await act(async () => {
      productStore.setState({
        products: [],
        setProduct: jest.fn(),
      });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Sem produtos no carrinho!"));
    });
  });
  it("should display empty cart message after deleting the last product", async () => {
    renderComponent();

    const removeButton = screen.getByText("-");

    await userEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText("Sem produtos no carrinho!"));
    });
  });
  it("should display empty cart message after deleting the last product", async () => {
    const checkoutUrl = "https://checkout.stripe.com/some-session-id";

    mock.onPost("http://localhost:3333/checkout").reply(200, {
      url: checkoutUrl,
    });

    renderComponent();

    Object.defineProperty(window, "location", {
      value: {
        pathname: "/cart",
        href: "",
        assign: jest.fn(),
        replace: jest.fn(),
      },
      writable: true,
    });

    const confirmButton = screen.getByText("Confirmar Pagamento");
    await userEvent.click(confirmButton);

    window.location.href = checkoutUrl;

    await waitFor(() => {
      expect(window.location.href).toBe(checkoutUrl);
    });
  });
});
