import { AuthForm } from "@/pages/login";
import { Posts } from "@/pages/Posts";
import { UnassignedRequests } from "@/pages/Requests";
import { BaseLayout } from "@/widgets";
import PrivateRoute from "@/widgets/layouts/private-route/private-route";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const appRouter = createBrowserRouter([
  {
    path: "/login",
    element: <AuthForm />,
    errorElement: <div>404</div>,
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        element: <BaseLayout />,
        children: [
          {
            path: "/",
            index: true,
            element: <Navigate to="/assigned" />,
            errorElement: <div>404</div>,
          },
          {
            path: "/unassigned",
            element: <UnassignedRequests />,
            errorElement: <div>404</div>,
          },
          {
            path: "/assigned",
            element: <div>assigned</div>,
            errorElement: <div>404</div>,
          },
          {
            path: "/completed",
            element: <Posts />,
            errorElement: <div>404</div>,
          },
          {
            path: "/monitoring",
            element: <div>monitoring</div>,
            errorElement: <div>404</div>,
          },
          {
            path: "/postponed",
            element: <div>postponed</div>,
            errorElement: <div>404</div>,
          },
          {
            path: "/history",
            element: <div>history</div>,
            errorElement: <div>404</div>,
          },
          {
            path: "/equipment",
            element: <div>equipment</div>,
            errorElement: <div>404</div>,
          },
          {
            path: "/admin",
            element: <div>admin</div>,
            errorElement: <div>404</div>,
          },
        ],
      },
    ],
  },
]);
