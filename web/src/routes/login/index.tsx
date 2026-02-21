import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { MdOutlineErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/sidebar";
import { useAuthenticateMutate } from "../../hooks/useAuthenticateMutate";
import { UserWithPurchasedProductsResponse } from "../myPurchase";
import {
  EmailInput,
  EmailInputContainer,
  ErrorMessageContainer,
  LoginButton,
  LoginContainer,
  LoginContent,
  LoginSubtitle,
  LoginTitle,
  PasswordInput,
  PasswordInputContainer,
  RegisterButton,
  SideBarContainer,
} from "./styles";

import axios from "axios";
import { userStore } from "../../store/userStore";

interface UserCredentials {
  email: string;
  password_hash: string;
}

export default function Login() {
  const navigate = useNavigate();

  const [userCredentials, setUserCredentials] = useState<UserCredentials>();
  const [errorMessage, setErrorMessage] = useState("");
  const { data, isSuccess, mutate, isError } = useAuthenticateMutate();
  const setUser = userStore((state) => state.setUser);

  const {
    data: userInfo,
    isSuccess: userFound,
    refetch,
  } = useQuery<UserWithPurchasedProductsResponse>({
    enabled: false,
    queryKey: ["userInfo"],

    queryFn: async () => {
      return axios
        .get(`http://localhost:3333/user?userId=${data?.userId}`)
        .then((response) => response.data);
    },
  });

  function handleAuthenticate(
    userAuthenticateCredentialsDetails: UserCredentials
  ) {
    if (userCredentials?.email === "") {
      return setErrorMessage("Insira o email.");
    }
    if (userCredentials?.password_hash === "") {
      return setErrorMessage("Insira a senha.");
    }

    mutate({ data: userAuthenticateCredentialsDetails });
  }

  function handleChangeUserDetailsForLogin(
    event: ChangeEvent<HTMLInputElement>,
    inputTitle: string
  ) {
    const { value } = event.target;
    setErrorMessage("");
    setUserCredentials((prevDetails) => ({
      ...prevDetails!,
      [inputTitle]: value,
    }));
  }

  useEffect(() => {
    if (isSuccess && data) {
      refetch();
    }

    if (isError) {
      setErrorMessage("Email ou senha incorretos. Tente novamente.");
    }

    if (userFound && data && data!.token!) {
      setUser({
        ...userInfo,
        token: data?.token,
      });

      navigate("/");
    }
  }, [isSuccess, isError, userFound, data]);

  return (
    <LoginContainer>
      <SideBarContainer>
        <SideBar />
      </SideBarContainer>
      <LoginContent>
        <LoginTitle>Bem-vindo</LoginTitle>
        <LoginSubtitle>Faça login para continuar</LoginSubtitle>

        {errorMessage && (
          <ErrorMessageContainer role="alert">
            <MdOutlineErrorOutline aria-hidden />
            <span>{errorMessage}</span>
          </ErrorMessageContainer>
        )}

        <EmailInputContainer>
          <span>Email</span>
          <EmailInput
            type="email"
            placeholder="Digite o email"
            onChange={(event) =>
              handleChangeUserDetailsForLogin(event, "email")
            }
          />
        </EmailInputContainer>
        <PasswordInputContainer>
          <span>Senha</span>
          <PasswordInput
            type="password"
            placeholder="Digite a senha"
            onChange={(event) =>
              handleChangeUserDetailsForLogin(event, "password_hash")
            }
          />
        </PasswordInputContainer>

        <LoginButton onClick={() => handleAuthenticate(userCredentials!)}>
          Entrar
        </LoginButton>
        <RegisterButton onClick={() => navigate("/register")}>
          Cadastrar
        </RegisterButton>
      </LoginContent>
    </LoginContainer>
  );
}
