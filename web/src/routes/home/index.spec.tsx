import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import Home from "./index";
import MockAdapter from "axios-mock-adapter";

let mock = new MockAdapter(axios);

function renderComponent() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Home component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();
  });
  it("should render loading and then the product", async () => {
    mock.onGet("http://localhost:3333/product").reply(200, [
      {
        props: {
          _id: "66be4c661a8a378d86e155e2",
          category: "animal",
          created_at: "2024-08-15T18:43:50.292Z",
          description: "Um cachorro maneiro!",
          image_url: "1723747430288-925904753.jpg",
          name: "Pug",
          stock: 2,
          unit_value: 20,
          user_id: "66bbe29601687421bfc7d301",
        },
      },
    ]);

    renderComponent();

    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Pug")).toBeInTheDocument();
      expect(screen.getByText("Um cachorro maneiro!")).toBeInTheDocument();
    });
  });
  it("should render loading and then display no products message when product length is zero", async () => {
    mock.onGet("http://localhost:3333/product").reply(200, []);

    renderComponent();
    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Não contém produtos cadastrados"
      );
    });
  });
});
