import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Home() {
  const items = [
    {
      name: "Node.js and Express book",
      quantity: 1,
      unitValue: 20,
    },
    {
      name: "JavaScript T-Shirt",
      quantity: 2,
      unitValue: 30,
    },
    {
      name: "Bola de futebol",
      quantity: 3,
      unitValue: 40,
    },
  ];

  const {
    data: success,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["checkout-info"],
    enabled: false,

    queryFn: async () => {
      return axios
        .post(`http://localhost:3333/checkout`, { items })
        .then((response) => response.data);
    },
  });

  console.log(success);

  useEffect(() => {
    if (isSuccess) {
      window.location.href = success.url;
    }
  }, [isSuccess]);

  return (
    <div>
      <button onClick={() => refetch()}>Pagar</button>
    </div>
  );
}
