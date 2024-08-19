import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { HomeContainer } from "./styles";
import SideBar from "../../components/sidebar/sideBar";

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

  return (
    <HomeContainer>
      <h1>Home</h1>
      <SideBar />
    </HomeContainer>
  );
}
