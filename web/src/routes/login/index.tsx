import { useEffect, useState, ChangeEvent } from "react";
import SideBar from "../../components/sidebar";
import { useAuthenticateMutate } from "../../hooks/useAuthenticateMutate";
import {
  EmailInput,
  EmailInputContainer,
  ErrorMessageContainer,
  LoginButton,
  LoginContainer,
  LoginContent,
  PasswordInput,
  PasswordInputContainer,
  RegisterButton,
  SideBarContainer,
} from "./styles";
import { useNavigate } from "react-router-dom";
import { UserWithPurchasedProductsResponse } from "../myPurchase";
import { useQuery } from "@tanstack/react-query";

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
      return setErrorMessage("insira o Email!");
    }
    if (userCredentials?.password_hash === "") {
      return setErrorMessage("insira a Senha!");
    }

    mutate({ data: userAuthenticateCredentialsDetails });
  }

  function handleChangeUserDetailsForLogin(
    event: ChangeEvent<HTMLInputElement>,
    inputTitle: string
  ) {
    const { value } = event.target;
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
      setErrorMessage("Email ou senha incorretos!");
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
        <EmailInputContainer>
          <span>Email</span>
          <EmailInput
            type="email"
            onChange={(event) =>
              handleChangeUserDetailsForLogin(event, "email")
            }
          />
        </EmailInputContainer>
        <PasswordInputContainer>
          <span>Senha</span>
          <PasswordInput
            type="password"
            onChange={(event) =>
              handleChangeUserDetailsForLogin(event, "password_hash")
            }
          />

          {errorMessage && (
            <ErrorMessageContainer>{errorMessage}</ErrorMessageContainer>
          )}
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
