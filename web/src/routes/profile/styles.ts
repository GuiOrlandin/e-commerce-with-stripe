import styled from "styled-components";

export const ProfileContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #f1f1f1;
  padding: 2.3rem;
`;

export const SideBar = styled.div`
  width: 250px;
  background: #ffffff;
`;

export const AvatarImageContainer = styled.div`
  display: flex;
  position: relative;

  button {
    position: absolute;
    border: none;
    background: none;
    width: 2rem;
    height: 2rem;
    top: 7.5rem;
    left: -1rem;

    &:focus {
      outline: none;
      border: none;
    }
  }

  svg {
    position: absolute;
    top: 8.2rem;
    cursor: pointer;
  }
`;
export const AvatarWithoutImageContainer = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 1rem;

  button {
    position: absolute;
    border: none;
    background: none;
    width: 2rem;
    height: 2rem;
    top: 7.5rem;
    left: -1rem;

    &:focus {
      outline: none;
      border: none;
    }
  }
`;

export const ContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  input {
    border-radius: 5px;
    padding: 0.3rem;
    border: 2px solid #f1f1f1;

    &:focus {
      border-color: #5e4a9e;
      outline: none;
    }
  }
`;

export const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 2rem;
  width: 80%;
  max-width: 800px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

export const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

export const InfoContainer = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: start;
  margin-bottom: 1rem;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.2rem;
`;

export const Info = styled.p`
  font-size: 1rem;
  color: #555;
  margin: 0;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1.5rem;
`;

export const EditButton = styled.button`
  background-color: #7462ba;
  color: white;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5e4a9e;
  }
`;
