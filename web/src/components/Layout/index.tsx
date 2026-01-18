import { Outlet } from "react-router-dom";
import SideBar from "../sidebar";
import { LayoutContainer, LayoutContent } from "./styles";

export default function Layout() {
  return (
    <LayoutContainer>
      <SideBar />
      <LayoutContent>
        <Outlet />
      </LayoutContent>
    </LayoutContainer>
  );
}
