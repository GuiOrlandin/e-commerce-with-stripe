import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { HomeContainer, ProductCartContainer } from "./styles";

import SideBar from "../../components/sidebar";
import ProductCart from "../../components/productCard";
import { useEffect } from "react";

export interface ProductsResponse {
  props: {
    _id: string;
    category?: string;
    created_at?: Date;
    description: string;
    image_url: string;
    name: string;
    stock?: number;
    quantity?: number;
    unit_value: number;
    user_id?: string;
  };
}

export default function Home() {
  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery<ProductsResponse[]>({
    queryKey: ["products"],

    queryFn: async () => {
      return axios
        .get(`http://localhost:3333/product`)
        .then((response) => response.data);
    },
  });

  useEffect(() => {
    if (products?.length === 0) {
      refetch();
    }
  }, [products]);

  return (
    <HomeContainer>
      <SideBar />

      {isLoading ? (
        <>
          <h1>Is loading...</h1>
        </>
      ) : (
        <ProductCartContainer>
          {products && products.length >= 1 ? (
            products!.map((product) => (
              <>
                <ProductCart
                  page="home"
                  key={product.props._id}
                  product={product}
                />
              </>
            ))
          ) : (
            <h2>Não contém produtos cadastrados</h2>
          )}
        </ProductCartContainer>
      )}
    </HomeContainer>
  );
}
