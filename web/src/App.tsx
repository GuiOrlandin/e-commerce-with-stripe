import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import { queryClient } from "./lib/react-query";
import Cart from "./routes/cart";
import Chat from "./routes/chat";
import Dashboard from "./routes/dashboard";
import Home from "./routes/home";
import Login from "./routes/login";
import MyPurchases from "./routes/myPurchase";
import Products from "./routes/products";
import Profile from "./routes/profile";
import Register from "./routes/register";
import Success from "./routes/success";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/cart",
          element: <Cart />,
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
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/chat",
          element: <Chat />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
