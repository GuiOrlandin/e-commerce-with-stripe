import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userStore } from "../store/userStore";

export interface ItemsUpdateUserDetails {
  name: string;
  adress: string | undefined;
  number: string | undefined;
  email: string;
  phone_number: string;
}

async function putData(
  data: ItemsUpdateUserDetails,
  authToken: string,
  file?: File[]
) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("adress", data.adress!);
    formData.append("email", data.email);
    formData.append("number", data.number!);
    formData.append("phone_number", data.phone_number!);

    if (file) {
      file.forEach((file) => {
        formData.append(`file`, file);
      });
    }

    await axios.put("http://localhost:3333/user", formData, config);
  } catch (error) {
    throw new Error("Falha ao fazer checkout");
  }
}

export function useUpdateUserMutate() {
  const queryClient = useQueryClient();
  const userInfo = userStore((state) => state.user);

  const mutate = useMutation({
    mutationFn: ({
      data,
      file,
    }: {
      data: ItemsUpdateUserDetails;
      file?: File[];
    }) => putData(data, userInfo!.token!, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-Info"] });
    },
  });

  return mutate;
}
