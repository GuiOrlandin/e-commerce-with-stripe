import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { userStore } from "../../store/userStore";
import Home from "../home";
import Register from "../register";

let mock = new MockAdapter(axios);

function renderComponent() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Register Page", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();
    mock.resetHistory();
    userStore.setState({ setUser: jest.fn() });
  });

  it("should render inputs and buttons", async () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Digite o email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite a senha")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite seu nome")).toBeInTheDocument();
    expect(screen.getByText("Registrar")).toBeInTheDocument();
  });
  it("should redirect to the home page after a successful register", async () => {
    mock.onPost("http://localhost:3333/user").reply(200, {
      name: "guilherme",
      email: "gui@gmail.com",
      created_at: new Date(),
    });

    mock.onPost("http://localhost:3333/signIn").reply(200, {
      access_token: {
        jwtToken: "mockToken",
        userId: "12345",
      },
    });

    mock.onGet(`http://localhost:3333/user?userId=12345`).reply(200, {
      id: "12345",
      name: "guilherme",
      email: "gui@gmail.com",
      role: "user",
      phone_number: "1234567890",
      purchasedProducts: [],
    });

    const setUserMock = jest.fn();
    userStore.setState({ setUser: setUserMock });

    renderComponent();

    const emailInput = screen.getByPlaceholderText("Digite o email");
    const passwordInput = screen.getByPlaceholderText("Digite a senha");
    const nameInput = screen.getByPlaceholderText("Digite seu nome");

    const registerButton = screen.getByText("Registrar");

    await userEvent.type(emailInput, "gui@gmail.com"),
      await userEvent.type(passwordInput, "123456"),
      await userEvent.type(nameInput, "guilherme"),
      await userEvent.click(registerButton);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(2);
    });

    await waitFor(() => {
      expect(setUserMock).toHaveBeenCalledWith({
        id: "12345",
        name: "guilherme",
        email: "gui@gmail.com",
        role: "user",
        phone_number: "1234567890",
        token: "mockToken",
        purchasedProducts: [],
      });
    });

    await waitFor(() => {
      expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });
  });
  it("should not redirect to the home page after a unsuccessful register", async () => {
    mock.onPost("http://localhost:3333/user").reply(500);

    renderComponent();

    const emailInput = screen.getByPlaceholderText("Digite o email");
    const passwordInput = screen.getByPlaceholderText("Digite a senha");
    const nameInput = screen.getByPlaceholderText("Digite seu nome");

    const registerButton = screen.getByText("Registrar");

    await userEvent.type(emailInput, "gui@gmail.com"),
      await userEvent.type(passwordInput, "123456"),
      await userEvent.type(nameInput, "guilherme"),
      await userEvent.click(registerButton);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

    await waitFor(() => {
      expect(screen.getByText("Email já em uso!")).toBeInTheDocument();
    });
  });
  it("should not redirect to the home page without email", async () => {
    renderComponent();

    const passwordInput = screen.getByPlaceholderText("Digite a senha");
    const nameInput = screen.getByPlaceholderText("Digite seu nome");

    const registerButton = screen.getByText("Registrar");

    await userEvent.type(passwordInput, "123456");
    await userEvent.type(nameInput, "guilherme");

    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText("insira o Email!")).toBeInTheDocument();
    });
  });
  it("should not redirect to the home page without name", async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText("Digite o email");
    const passwordInput = screen.getByPlaceholderText("Digite a senha");

    const registerButton = screen.getByText("Registrar");

    await userEvent.type(emailInput, "gui@gmail.com");
    await userEvent.type(passwordInput, "123456");
    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText("insira o nome!")).toBeInTheDocument();
    });
  });
  it("should not redirect to the home page without password", async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText("Digite o email");
    const nameInput = screen.getByPlaceholderText("Digite seu nome");

    const registerButton = screen.getByText("Registrar");

    await userEvent.type(emailInput, "gui@gmail.com");
    await userEvent.type(nameInput, "guilherme");
    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText("insira a Senha!")).toBeInTheDocument();
    });
  });
});
