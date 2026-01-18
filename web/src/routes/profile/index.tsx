import { useEffect, useState } from "react";
import { userStore } from "../../store/userStore";
import {
  Avatar,
  AvatarImageContainer,
  AvatarWithoutImageContainer,
  ButtonContainer,
  CancelButton,
  ContentWrapper,
  EditButton,
  Info,
  InfoContainer,
  InfoRow,
  Label,
  ProfileContainer,
  ProfileContent,
  ProfileInput,
  ProfileInputMask,
  ProfileSubtitle,
  ProfileTitle,
} from "./styles";

import { useDropzone } from "react-dropzone";
import { MdFileUpload } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { useUserFetch } from "../../hooks/useUserInfoFetch";
import { useUpdateUserMutate } from "../../hooks/useUserUpdateMutate";

interface ProfileUpdateInfoProps {
  name: string;
  adress: string | undefined;
  number: string | undefined;
  email: string;
  phone_number: string;
}

export default function Profile() {
  const userInfo = userStore((state) => state.user);
  const setUserInfo = userStore((state) => state.setUser);
  const [toggleEditProfile, setToggleEditProfile] = useState<boolean>(false);
  const { mutate, isSuccess, reset } = useUpdateUserMutate();
  const [profileUpdateInfo, setProfileUpdateInfo] =
    useState<ProfileUpdateInfoProps>();
  const {
    data: userInfoFetched,
    isSuccess: userFetched,
    refetch,
  } = useUserFetch(userInfo!.id!);

  const [avatarImage, setAvatarImage] = useState<File[] | null>();
  const [imagePreview, setImagePreview] = useState<string | null>();

  function onDropAvatarImage(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    setAvatarImage(acceptedFiles);
    setImagePreview(URL.createObjectURL(file));
  }

  const avatarImageUpload = useDropzone({
    onDrop: onDropAvatarImage,
    accept: {
      "image/*": [],
    },
  });

  function handleUpdateUserInfo() {
    mutate({
      file: avatarImage!,
      data: {
        adress: profileUpdateInfo?.adress,
        email: profileUpdateInfo?.email!,
        name: profileUpdateInfo?.name!,
        number: profileUpdateInfo?.number,
        phone_number: profileUpdateInfo?.phone_number!,
      },
    });
  }

  useEffect(() => {
    if (userInfo && !profileUpdateInfo) {
      setProfileUpdateInfo({
        adress: userInfo!.adress,
        email: userInfo!.email,
        name: userInfo!.name,
        number: userInfo!.number,
        phone_number: userInfo.phone_number,
      });
    }

    if (isSuccess && toggleEditProfile) {
      refetch().then((res) => {
        if (res.data) {
          setUserInfo({
            ...userInfo,
            name: res.data.name,
            adress: res.data.adress,
            email: res.data.email,
            number: res.data.number,
            phone_number: res.data.phone_number,
            profile_picture: res.data.profile_picture,
            purchasedProducts: res.data.purchasedProducts,
            role: res.data.role,
          });

          setToggleEditProfile(false);
        }
      });

      reset();
    }
  }, [
    userInfo,
    isSuccess,
    userFetched,
    profileUpdateInfo,
    toggleEditProfile,
    userInfoFetched,
  ]);

  console.log(userInfo);

  return (
    <ProfileContainer>
      <ContentWrapper>
        {toggleEditProfile ? (
          <ProfileContent>
            <ProfileTitle>Editar Perfil</ProfileTitle>
            <ProfileSubtitle>Atualize suas informações pessoais</ProfileSubtitle>

            {imagePreview ? (
              <AvatarImageContainer {...avatarImageUpload.getRootProps()}>
                <Avatar role="img" src={imagePreview} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview("");
                    setAvatarImage(null);
                  }}
                >
                  ×
                </button>
              </AvatarImageContainer>
            ) : (
              <AvatarWithoutImageContainer
                {...avatarImageUpload.getRootProps()}
              >
                {userInfo && userInfo.profile_picture ? (
                  <Avatar
                    role="img"
                    src={`http://localhost:3333/files/userAvatar/${userInfo.profile_picture}`}
                  />
                ) : (
                  <RxAvatar role="img" size={150} color="#7462ba" />
                )}
                <button type="button">
                  <MdFileUpload size={24} />
                </button>
              </AvatarWithoutImageContainer>
            )}

            <InfoContainer>
              <Label>Nome</Label>
              <ProfileInput
                type="text"
                data-testid="name-input"
                value={profileUpdateInfo!.name}
                onChange={(e) =>
                  setProfileUpdateInfo({
                    ...profileUpdateInfo!,
                    name: e.target.value,
                  })
                }
                placeholder="Digite seu nome"
              />
            </InfoContainer>
            <InfoContainer>
              <Label>Email</Label>
              <ProfileInput
                type="email"
                value={profileUpdateInfo!.email}
                onChange={(e) =>
                  setProfileUpdateInfo({
                    ...profileUpdateInfo!,
                    email: e.target.value,
                  })
                }
                placeholder="Digite seu email"
              />
            </InfoContainer>
            <InfoRow>
              <InfoContainer>
                <Label>Endereço de Entrega</Label>
                <ProfileInput
                  type="text"
                  value={profileUpdateInfo!.adress || ""}
                  onChange={(e) =>
                    setProfileUpdateInfo({
                      ...profileUpdateInfo!,
                      adress: e.target.value,
                    })
                  }
                  placeholder="Digite seu endereço"
                />
              </InfoContainer>
              <InfoContainer>
                <Label>Número</Label>
                <ProfileInput
                  type="text"
                  value={profileUpdateInfo!.number || ""}
                  onChange={(e) =>
                    setProfileUpdateInfo({
                      ...profileUpdateInfo!,
                      number: e.target.value,
                    })
                  }
                  placeholder="Digite o número"
                />
              </InfoContainer>
            </InfoRow>
            <InfoContainer>
              <Label>Telefone</Label>
              <ProfileInputMask
                mask="(99) 99999-9999"
                value={profileUpdateInfo!.phone_number}
                onChange={(e) =>
                  setProfileUpdateInfo({
                    ...profileUpdateInfo!,
                    phone_number: e.target.value,
                  })
                }
                placeholder="(00) 00000-0000"
              />
            </InfoContainer>
            <ButtonContainer>
              <CancelButton onClick={() => setToggleEditProfile(false)}>
                Cancelar
              </CancelButton>
              <EditButton onClick={() => handleUpdateUserInfo()}>
                Salvar Alterações
              </EditButton>
            </ButtonContainer>
          </ProfileContent>
        ) : (
          <ProfileContent>
            <ProfileTitle>Meu Perfil</ProfileTitle>
            <ProfileSubtitle>Gerencie suas informações pessoais</ProfileSubtitle>

            {userInfo && userInfo.profile_picture ? (
              <Avatar
                role="img"
                src={`http://localhost:3333/files/userAvatar/${userInfo.profile_picture}`}
              />
            ) : (
              <RxAvatar role="img" size={150} color="#7462ba" />
            )}

            <InfoContainer>
              <Label>Nome</Label>
              <Info>{userInfo.name}</Info>
            </InfoContainer>
            <InfoContainer>
              <Label>Email</Label>
              <Info>{userInfo.email}</Info>
            </InfoContainer>
            <InfoRow>
              <InfoContainer>
                <Label>Endereço de Entrega</Label>
                <Info>
                  {userInfo.adress
                    ? userInfo.adress
                    : "Nenhum endereço fornecido"}
                </Info>
              </InfoContainer>
              <InfoContainer>
                <Label>Número</Label>
                <Info>
                  {userInfo.number
                    ? userInfo.number
                    : "Nenhum número fornecido"}
                </Info>
              </InfoContainer>
            </InfoRow>
            <InfoContainer>
              <Label>Telefone</Label>
              <Info>
                {userInfo.phone_number
                  ? userInfo.phone_number
                  : "Nenhum telefone fornecido"}
              </Info>
            </InfoContainer>
            <ButtonContainer>
              <EditButton onClick={() => setToggleEditProfile(true)}>
                Editar Perfil
              </EditButton>
            </ButtonContainer>
          </ProfileContent>
        )}
      </ContentWrapper>
    </ProfileContainer>
  );
}
