import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UserAuthenticationDetails {
  email: string;
  password_hash: string;
}

async function postData(data?: UserAuthenticationDetails) {
  try {
    const response = await axios.post("http://localhost:3333/signIn", data);
    const accessToken = await response.data.access_token;

    return {
      token: accessToken.jwtToken,
      userId: accessToken.userId,
    };
  } catch (error) {
    throw new Error("Falha ao autenticar usuário");
  }
}

export function useAuthenticateMutate() {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: ({ data }: { data?: UserAuthenticationDetails }) =>
      postData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return mutate;
}
