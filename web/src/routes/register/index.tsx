import { useState, ChangeEvent, useEffect } from "react";
import SideBar from "../../components/sidebar";

import { EmailInput, PasswordInput } from "../login/styles";
import {
  EmailInputContainer,
  ErrorMessageContainer,
  NameInput,
  NameInputContainer,
  PasswordInputContainer,
  RegisterButton,
  RegisterContainer,
  RegisterContent,
  SideBarContainer,
} from "./styles";
import { useAuthenticateMutate } from "../../hooks/useAuthenticateMutate";
import { useNavigate } from "react-router-dom";
import {
  UserRegisterDetails,
  useUserRegisterMutate,
} from "../../hooks/useUserRegisterMutate";
import { UserWithPurchasedProductsResponse } from "../myPurchase";
import { useQuery } from "@tanstack/react-query";
import { userStore } from "../../store/userStore";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [userRegisterCredentials, setUserRegisterCredentials] =
    useState<UserRegisterDetails>();
  const [errorMessage, setErrorMessage] = useState("");
  const setUser = userStore((state) => state.setUser);

  const { mutate, isSuccess, isError } = useUserRegisterMutate();
  const {
    mutate: loginMutate,
    isSuccess: loginSuccess,
    data,
  } = useAuthenticateMutate();

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

  function handleChangeUserRegisterDetails(
    event: ChangeEvent<HTMLInputElement>,
    inputTitle: string
  ) {
    const { value } = event.target;
    setUserRegisterCredentials((prevDetails) => ({
      ...prevDetails!,
      [inputTitle]: value,
    }));
  }

  function handleRegister() {
    if (userRegisterCredentials?.email === "") {
      return setErrorMessage("insira o Email!");
    }
    if (userRegisterCredentials?.password_hash === "") {
      return setErrorMessage("insira a Senha!");
    }
    if (userRegisterCredentials?.name === "") {
      return setErrorMessage("insira o nome!");
    }

    mutate({
      email: userRegisterCredentials!.email,
      name: userRegisterCredentials!.name,
      password_hash: userRegisterCredentials!.password_hash,
    });
  }

  useEffect(() => {
    if (isSuccess && userRegisterCredentials) {
      loginMutate({
        data: {
          email: userRegisterCredentials?.email,
          password_hash: userRegisterCredentials?.password_hash,
        },
      });

      if (loginSuccess) {
        refetch();
      }

      if (userFound && data && data!.token!) {
        setUser({
          ...userInfo,
          token: data?.token,
        });

        navigate("/");
      }
    }

    if (isError) {
      setErrorMessage("Email ja em uso!");
    }
  }, [isSuccess, loginSuccess, isError, userFound, data]);

  return (
    <RegisterContainer>
      <SideBarContainer>
        <SideBar />
      </SideBarContainer>
      <RegisterContent>
        <EmailInputContainer>
          <span>Email</span>
          <EmailInput
            type="email"
            onChange={(event) =>
              handleChangeUserRegisterDetails(event, "email")
            }
          />
        </EmailInputContainer>
        <PasswordInputContainer>
          <span>Senha</span>
          <PasswordInput
            type="password"
            onChange={(event) =>
              handleChangeUserRegisterDetails(event, "password_hash")
            }
          />
        </PasswordInputContainer>
        <NameInputContainer>
          <span>Nome</span>
          <NameInput
            type="text"
            onChange={(event) => handleChangeUserRegisterDetails(event, "name")}
          />
        </NameInputContainer>
        {errorMessage && (
          <ErrorMessageContainer>{errorMessage}</ErrorMessageContainer>
        )}
        <RegisterButton onClick={() => handleRegister()}>
          Registrar
        </RegisterButton>
      </RegisterContent>
    </RegisterContainer>
  );
}
