import { useEffect, useState } from "react";
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
  AvatarImageContainer,
  AvatarWithoutImageContainer,
} from "./styles";

import { useDropzone } from "react-dropzone";
import { MdFileUpload } from "react-icons/md";
import { useUpdateUserMutate } from "../../hooks/useUserUpdateMutate";
import { useUserFetch } from "../../hooks/useUserInfoFetch";
import { RxAvatar } from "react-icons/rx";

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

  return (
    <ProfileContainer>
      <SideBar />
      <ContentWrapper>
        {toggleEditProfile ? (
          <ProfileContent>
            {imagePreview ? (
              <AvatarImageContainer {...avatarImageUpload.getRootProps()}>
                <Avatar role="img" src={imagePreview} />

                <button onClick={() => setImagePreview("")}>x</button>
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
                  <RxAvatar role="img" size={150} />
                )}
                <button>
                  <MdFileUpload height={24} />
                </button>
              </AvatarWithoutImageContainer>
            )}

            <InfoContainer>
              <Label>Nome:</Label>
              <input
                type="text"
                data-testid="name-input"
                value={profileUpdateInfo!.name}
                onChange={(e) =>
                  setProfileUpdateInfo({
                    ...profileUpdateInfo!,
                    name: e.target.value,
                  })
                }
              />
            </InfoContainer>
            <InfoContainer>
              <Label>Email:</Label>
              <input
                type="text"
                value={profileUpdateInfo!.email}
                onChange={(e) =>
                  setProfileUpdateInfo({
                    ...profileUpdateInfo!,
                    email: e.target.value,
                  })
                }
              />
            </InfoContainer>
            <InfoContainer>
              <Label>Endereço de Entrega:</Label>
              <input
                type="text"
                value={profileUpdateInfo!.adress}
                onChange={(e) =>
                  setProfileUpdateInfo({
                    ...profileUpdateInfo!,
                    adress: e.target.value,
                  })
                }
              />
              <Label>Numero:</Label>
              <input
                type="text"
                value={profileUpdateInfo!.number}
                onChange={(e) =>
                  setProfileUpdateInfo({
                    ...profileUpdateInfo!,
                    number: e.target.value,
                  })
                }
              />
            </InfoContainer>
            <InfoContainer>
              <Label>Telefone:</Label>
              <input
                type="text"
                value={profileUpdateInfo!.phone_number}
                onChange={(e) =>
                  setProfileUpdateInfo({
                    ...profileUpdateInfo!,
                    phone_number: e.target.value,
                  })
                }
              />
            </InfoContainer>
            <ButtonContainer>
              <EditButton onClick={() => handleUpdateUserInfo()}>
                Confirme
              </EditButton>
            </ButtonContainer>
          </ProfileContent>
        ) : (
          <ProfileContent>
            {userInfo && userInfo.profile_picture ? (
              <>
                <Avatar
                  role="img"
                  src={`http://localhost:3333/files/userAvatar/${userInfo.profile_picture}`}
                />
              </>
            ) : (
              <>
                <RxAvatar role="img" size={96} />
              </>
            )}

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
                {userInfo.adress
                  ? userInfo.adress
                  : "nenhum endereço fornecido."}
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
