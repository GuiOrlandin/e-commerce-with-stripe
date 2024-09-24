import React from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { userStore } from "../../store/userStore";
import Profile from ".";

let mock = new MockAdapter(axios);

function renderComponent() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Profile page", () => {
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
        purchasedProducts: [],
      },
      setUser: jest.fn(),
    });
  });

  it("should render inputs and buttons", async () => {
    renderComponent();

    expect(screen.getByText("Nome:")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("Endereço de Entrega:")).toBeInTheDocument();
    expect(screen.getByText("Numero:")).toBeInTheDocument();
    expect(screen.getByText("Telefone:")).toBeInTheDocument();
  });
  it("Should re-render after successfully editing a user, even without changes.", async () => {
    mock.onPut("http://localhost:3333/user").reply(200);

    mock.onGet(`http://localhost:3333/user?userId=1`).reply(200, {
      name: "Guilherme Orlandin",
      email: "gui@gmail.com",
      adress: "Rua Exemplo, 456",
      number: "456",
      phone_number: "987654321",
      profile_picture: "new_picture_url",
      purchasedProducts: [],
      role: "user",
    });

    renderComponent();

    const toggleButton = screen.getByText("Editar Perfil");
    await userEvent.click(toggleButton);

    expect(screen.getByText("Confirme")).toBeInTheDocument();

    const confirmButton = screen.getByText("Confirme");
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mock.history.put.length).toBe(1);
    });

    await waitFor(() => {
      expect(screen.queryByText("Confirme")).not.toBeInTheDocument();
      expect(screen.getByText("Editar Perfil")).toBeInTheDocument();
    });
  });
  it("Should re-render after successfully editing a user with changes.", async () => {
    mock.onPut("http://localhost:3333/user").reply(200);

    mock.onGet(`http://localhost:3333/user?userId=1`).reply(200, {
      name: "Guilherme Orlandin",
      email: "gui@gmail.com",
      adress: "Rua Exemplo, 456",
      number: "456",
      phone_number: "987654321",
      profile_picture: "new_picture_url",
      purchasedProducts: [],
      role: "user",
    });

    renderComponent();

    const toggleButton = screen.getByText("Editar Perfil");
    await userEvent.click(toggleButton);

    const inputName = await screen.findByTestId("name-input");

    await userEvent.clear(inputName);
    await userEvent.type(inputName, "Guilherme Orlandin");

    const confirmButton = screen.getByText("Confirme");
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mock.history.put.length).toBe(1);
    });

    await act(async () => {
      userStore.setState({
        user: {
          id: "1",
          name: "Guilherme Orlandin",
          email: "gui@gmail.com",
          adress: "Rua Exemplo",
          number: "456",
          phone_number: "987654321",
          profile_picture: "new_picture_url",
          role: "user",
          token: "jwtToken",
          purchasedProducts: [],
        },
      });
    });

    await waitFor(() => {
      expect(screen.queryByText("Confirme")).not.toBeInTheDocument();
      expect(screen.getByText("Editar Perfil")).toBeInTheDocument();
      expect(screen.getByText("Guilherme Orlandin")).toBeInTheDocument();
    });
  });
});
