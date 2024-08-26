import { useEffect, useState, ChangeEvent } from "react";
import SideBar from "../../components/sidebar";
import { useAuthenticateMutate } from "../../hooks/userAuthenticate";
import { tokenStore } from "../../store/tokenStore";
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

interface UserCredentials {
  email: string;
  password_hash: string;
}

export default function Login() {
  const navigate = useNavigate();

  const [userCredentials, setUserCredentials] = useState<UserCredentials>();
  const [errorMessage, setErrorMessage] = useState("");
  const { data, isSuccess, mutate, isError } = useAuthenticateMutate();

  console.log(errorMessage);

  const setToken = tokenStore((state) => state.setToken);

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
      setToken(data);

      navigate("/");
    }

    if (isError) {
      setErrorMessage("Email ou senha incorretos!");
    }
  }, [isSuccess, isError]);

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