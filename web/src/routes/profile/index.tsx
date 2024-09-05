import SideBar from "../../components/sidebar";
import { userStore } from "../../store/userStore";
import {
  ProfileContent,
  Avatar,
  InfoContainer,
  Label,
  Info,
  ButtonContainer,
  EditButton,
  ProfileContainer,
  ContentWrapper,
} from "./styles";

export default function Profile() {
  const userInfo = userStore((state) => state.user);

  return (
    <ProfileContainer>
      <SideBar />
      <ContentWrapper>
        <ProfileContent>
          <Avatar src="https://via.placeholder.com/150" alt="User Avatar" />
          <InfoContainer>
            <Label>Nome:</Label>
            <Info>{userInfo.name}</Info>
          </InfoContainer>
          <InfoContainer>
            <Label>Email:</Label>
            <Info>{userInfo.email}</Info>
          </InfoContainer>
          <InfoContainer>
            <Label>Endereço de Entrega:</Label>
            <Info>
              {userInfo.adress ? userInfo.adress : "nenhum endereço fornecido."}
            </Info>
            <Label>Numero:</Label>
            <Info>
              {userInfo.number ? userInfo.number : "nenhum numero fornecido."}
            </Info>
          </InfoContainer>
          <InfoContainer>
            <Label>Telefone:</Label>
            <Info>43 9848587457</Info>
          </InfoContainer>
          <ButtonContainer>
            <EditButton>Editar Perfil</EditButton>
          </ButtonContainer>
        </ProfileContent>
      </ContentWrapper>
    </ProfileContainer>
  );
}
