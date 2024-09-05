import "./App.css";
import { queryClient } from "./lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Home from "./routes/home";
import Cart from "./routes/cart";
import Login from "./routes/login";
import Register from "./routes/register";
import MyPurchases from "./routes/myPurchase";
import Success from "./routes/success";
import Profile from "./routes/profile";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/my_purchases",
      element: <MyPurchases />,
    },
    {
      path: "/success",
      element: <Success />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
