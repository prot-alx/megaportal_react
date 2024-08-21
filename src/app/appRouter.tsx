import { createBrowserRouter, Navigate } from "react-router-dom";
import { Posts } from "../pages/Posts";
import { Requests } from "../pages/Requests";
import { BaseLayout } from "../widgets";
import { AuthForm } from "@/pages/login";

export const appRouter = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        index: true,
        element: <Navigate to="/unassigned" />,
        errorElement: <div>404</div>,
      },
      {
        path: "/unassigned",
        index: true,
        element: <Requests />,
        errorElement: <div>404</div>,
      },
      {
        path: "/login",
        index: true,
        element: <AuthForm />,
        errorElement: <div>404</div>,
      },
      {
        path: "/assigned",
        index: true,
        element: <div>assigned</div>,
        errorElement: <div>404</div>,
      },
      {
        path: "/completed",
        index: true,
        element: (
          <div>
            <Posts />
          </div>
        ),
        errorElement: <div>404</div>,
      },
      {
        path: "/monitoring",
        index: true,
        element: <div>monitoring</div>,
        errorElement: <div>404</div>,
      },
      {
        path: "/postponed",
        index: true,
        element: <div>postponed</div>,
        errorElement: <div>404</div>,
      },
      {
        path: "/history",
        index: true,
        element: <div>history</div>,
        errorElement: <div>404</div>,
      },
      {
        path: "/equipment",
        index: true,
        element: <div>equipment</div>,
        errorElement: <div>404</div>,
      },
      {
        path: "/admin",
        index: true,
        element: <div>equipment</div>,
        errorElement: <div>404</div>,
      },
    ],
  },
]);
