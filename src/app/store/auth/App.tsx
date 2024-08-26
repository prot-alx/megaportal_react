// App.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { appRouter } from "@/app/appRouter";
import { checkAuth } from "./checkAuth";
import { RouterProvider } from "react-router-dom";

export const App = () => {
  const dispatch = useAppDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const authenticate = async () => {
      try {
        await checkAuth();
      } finally {
        setIsAuthChecked(true);
      }
    };

    authenticate();
  }, [dispatch]);

  if (isLoading || !isAuthChecked) {
    return <div></div>;
  }

  return <RouterProvider router={appRouter} />;
};
