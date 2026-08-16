import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/app/layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/",
        lazy: async () => {
          const { LoginPage } = await import("@/features/auth/pages/LoginPage");
          return { Component: LoginPage };
        },
      },
      {
        path: "/login",
        lazy: async () => {
          const { LoginPage } = await import("@/features/auth/pages/LoginPage");
          return { Component: LoginPage };
        },
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            lazy: async () => {
              const { DashboardPage } = await import(
                "@/features/dashboard/pages/DashboardPage"
              );
              return { Component: DashboardPage };
            },
          },
          {
            path: "/transfer",
            lazy: async () => {
              const { TransferPage } = await import(
                "@/features/transfer/pages/TransferPage"
              );
              return { Component: TransferPage };
            },
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
