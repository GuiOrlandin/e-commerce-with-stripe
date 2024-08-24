import SideBar from "../../components/sidebar";
import {
  EmailInput,
  EmailInputContainer,
  LoginButton,
  LoginContainer,
  LoginContent,
  PasswordInput,
  PasswordInputContainer,
  RegisterButton,
  SideBarContainer,
} from "./styles";

export default function Login() {
  return (
    <LoginContainer>
      <SideBarContainer>
        <SideBar />
      </SideBarContainer>
      <LoginContent>
        <EmailInputContainer>
          <span>Email</span>
          <EmailInput type="email" />
        </EmailInputContainer>
        <PasswordInputContainer>
          <span>Senha</span>
          <PasswordInput type="password" />
        </PasswordInputContainer>

        <LoginButton>Entrar</LoginButton>
        <RegisterButton>Cadastrar</RegisterButton>
      </LoginContent>
    </LoginContainer>
  );
}
