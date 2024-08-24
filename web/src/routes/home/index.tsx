import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { HomeContainer, ProductCartContainer } from "./styles";

import SideBar from "../../components/sidebar";
import ProductCart from "../../components/productCard";

export interface ProductsResponse {
  props: {
    _id: string;
    category: string;
    created_at: Date;
    description: string;
    image_url: string;
    name: string;
    stock?: number;
    quantity?: number;
    unit_value: number;
    user_id: string;
  };
}

export default function Home() {
  // const {
  //   data: success,
  //   refetch,
  //   isSuccess,
  // } = useQuery({
  //   queryKey: ["checkout-info"],
  //   enabled: false,

  //   queryFn: async () => {
  //     return axios
  //       .post(`http://localhost:3333/checkout`, { items })
  //       .then((response) => response.data);
  //   },
  // });

  // useEffect(() => {
  //   if (isSuccess) {
  //     window.location.href = success.url;
  //   }
  // }, [isSuccess]);

  const { data: products, isLoading } = useQuery<ProductsResponse[]>({
    queryKey: ["products"],

    queryFn: async () => {
      return axios
        .get(`http://localhost:3333/product`)
        .then((response) => response.data);
    },
  });

  return (
    <HomeContainer>
      <SideBar />

      {isLoading ? (
        <>
          <h1>Is loading...</h1>
        </>
      ) : (
        <ProductCartContainer>
          {products &&
            products!.map((product) => (
              <>
                <ProductCart
                  page="home"
                  key={product.props._id}
                  product={product}
                />
              </>
            ))}
        </ProductCartContainer>
      )}
    </HomeContainer>
  );
}
