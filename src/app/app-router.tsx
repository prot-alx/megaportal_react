import { createBrowserRouter, Navigate } from "react-router-dom";
import { RequestStatus } from "./services/requestApi";
import { AllRequests, BaseLayout, PrivateRoute } from "@/widgets";
import { AuthPage } from "@/pages";

export const appRouter = createBrowserRouter([
  {
    path: "/login",
    element: <AuthPage />,
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
            element: <Navigate to="/unassigned" />,
            errorElement: <div>404</div>,
          },
          {
            path: "/unassigned",
            element: <AllRequests status={[RequestStatus.NEW]} />,
            errorElement: <div>404</div>,
          },
          {
            path: "/assigned",
            element: <AllRequests status={[RequestStatus.IN_PROGRESS]} />,
            errorElement: <div>404</div>,
          },
          {
            path: "/completed",
            element: <AllRequests status={[RequestStatus.SUCCESS]} />,
            errorElement: <div>404</div>,
          },
          {
            path: "/monitoring",
            element: <AllRequests status={[RequestStatus.MONITORING]} />,
            errorElement: <div>404</div>,
          },
          {
            path: "/postponed",
            element: <AllRequests status={[RequestStatus.POSTPONED]} />,
            errorElement: <div>404</div>,
          },
          {
            path: "/history",
            element: (
              <AllRequests
                status={[RequestStatus.CLOSED, RequestStatus.CANCELLED]}
              />
            ), // Обратите внимание на массив
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
