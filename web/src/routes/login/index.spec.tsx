import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Login from "./index";
import { userStore } from "../../store/userStore";
import Home from "../home";
import Register from "../register";

let mock = new MockAdapter(axios);

function renderComponent() {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Login component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();
    userStore.setState({ setUser: jest.fn() });
  });

  it("should render login input and buttons", async () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Digite o email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite a senha")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar")).toBeInTheDocument();
  });
  it("should redirect to the home page after a successful login", async () => {
    mock.onPost("http://localhost:3333/signIn").reply(200, {
      access_token: {
        jwtToken: "mockToken",
        userId: "12345",
      },
    });

    mock.onGet(`http://localhost:3333/user?userId=12345`).reply(200, {
      id: "12345",
      name: "User",
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
    const loginButton = screen.getByText("Entrar");

    await userEvent.type(emailInput, "gui@gmail.com"),
      await userEvent.type(passwordInput, "123456"),
      await userEvent.click(loginButton);

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

    await waitFor(() => {
      expect(setUserMock).toHaveBeenCalledWith({
        id: "12345",
        name: "User",
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

  it("should not redirect to the home page after an unsuccessful login", async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText("Digite o email");
    const passwordInput = screen.getByPlaceholderText("Digite a senha");
    const loginButton = screen.getByText("Entrar");

    await userEvent.type(emailInput, "gui@gmail.com"),
      await userEvent.type(passwordInput, "123456"),
      await userEvent.click(loginButton);

    await waitFor(() => {
      expect(
        screen.getByText("Email ou senha incorretos!")
      ).toBeInTheDocument();
    });
  });

  it("should  redirect to the register page after click on Cadastrar", async () => {
    renderComponent();

    const registerButton = screen.getByText("Cadastrar");

    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText("Nome")).toBeInTheDocument();
    });
  });
});
