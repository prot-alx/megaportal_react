import { useEffect, useState } from "react";
import { appRouter } from "@/app/app-router";
import { checkAuth } from "./auth-check";
import { RouterProvider } from "react-router-dom";

export const App = () => {
  const [isInitialAuthChecked, setIsInitialAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!isInitialAuthChecked) {
        try {
          // Если мы уже на странице логина, не делаем проверку
          if (window.location.pathname === '/login') {
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

  // Показываем loader только при первой проверке
  if (!isInitialAuthChecked) {
    return <div>Loading...</div>;
  }

  return <RouterProvider router={appRouter} />;
};