import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { UserWithPurchasedProductsResponse } from "../routes/myPurchase";

async function fetchUserData(userId: string) {
  const response = await axios.get(
    `http://localhost:3333/user?userId=${userId}`
  );
  return response.data;
}

export function useUserFetch(userId: string) {
  return useQuery<UserWithPurchasedProductsResponse>({
    queryKey: ["userInfo"],
    queryFn: () => fetchUserData(userId),
    enabled: !!userId,
  });
}
