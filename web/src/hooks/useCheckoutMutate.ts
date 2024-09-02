import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userStore } from "../store/userStore";

export interface ItemsCheckoutDetails {
  name: string;
  _id: string;
  image_url: string;
  description: string;
  quantity: number;
  unitValue: number;
}

async function postData(items: ItemsCheckoutDetails[], authToken: string) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      "http://localhost:3333/checkout",
      { items },
      config
    );

    return response.data.url;
  } catch (error) {
    throw new Error("Falha ao fazer checkout");
  }
}

export function useCheckoutMutate() {
  const queryClient = useQueryClient();
  const userInfo = userStore((state) => state.user);

  const mutate = useMutation({
    mutationFn: ({ items }: { items: ItemsCheckoutDetails[] }) =>
      postData(items, userInfo!.token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return mutate;
}
