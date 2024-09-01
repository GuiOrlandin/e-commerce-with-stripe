import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tokenStore } from "../store/tokenStore";

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
  const authToken = tokenStore((state) => state.token);

  const mutate = useMutation({
    mutationFn: ({ items }: { items: ItemsCheckoutDetails[] }) =>
      postData(items, authToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return mutate;
}
