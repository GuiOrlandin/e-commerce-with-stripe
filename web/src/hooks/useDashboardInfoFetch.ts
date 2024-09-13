import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { userStore } from "../store/userStore";

export interface DataItems {
  amount_total: number;
  purchase_id: string;
  product_id: string;
  name: string;
  description: string;
  image_url: string;
  unit_amount: number;
  quantity: number;
  status: string;
  created_at?: Date;
}

export interface DashboardItems {
  month: string;
  totalIncome: number;
  soldProducts: DataItems[];
}

async function fetchDashboardInfoData(authToken: string) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const response = await axios.get(
      `http://localhost:3333/user/dashboard`,
      config
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard info:", error);
    throw error;
  }
}

export function useDashboardFetch() {
  const userInfo = userStore((state) => state.user);

  return useQuery<DashboardItems[]>({
    queryKey: ["dashboard-Info"],
    queryFn: () => fetchDashboardInfoData(userInfo!.token!),
  });
}
