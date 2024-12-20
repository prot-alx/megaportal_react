import { useEffect, useState } from "react";
import { appRouter } from "@/app/app-router";
import { checkAuth } from "./auth.check";
import { RouterProvider } from "react-router-dom";
import { LoadingSpinner } from "@/shared";

export const App = () => {
  const [isInitialAuthChecked, setIsInitialAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!isInitialAuthChecked) {
        try {
          if (window.location.pathname === "/login") {
            setIsInitialAuthChecked(true);
            return;
          }
          await checkAuth();
        } finally {
          if (mounted) {
            setIsInitialAuthChecked(true);
          }
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  if (!isInitialAuthChecked) {
    return (
      <div className="flex bg-slate-200 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <RouterProvider router={appRouter} />;
};
