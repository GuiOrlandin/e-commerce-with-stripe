import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { userStore } from "../store/userStore";

export interface CreateProductDetails {
  name: string;
  description?: string;
  category?: string;
  unit_value: string;
  stock: string;
}

async function postData(
  data: CreateProductDetails,
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
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.category) {
      formData.append("category", data.category);
    }
    if (data.unit_value) {
      formData.append("unit_value", data.unit_value);
    }
    if (data.stock) {
      formData.append("stock", data.stock);
    }

    if (file && file.length > 0) {
      formData.append("file", file[0]);
    }

    const response = await axios.post(
      "http://localhost:3333/product",
      formData,
      config
    );

    return response.data;
  } catch {
    throw new Error("Falha ao criar produto");
  }
}

export function useCreateProductMutate() {
  const queryClient = useQueryClient();
  const userInfo = userStore((state) => state.user);

  const mutate = useMutation({
    mutationFn: ({
      data,
      file,
    }: {
      data: CreateProductDetails;
      file?: File[];
    }) => postData(data, userInfo!.token!, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return mutate;
}
