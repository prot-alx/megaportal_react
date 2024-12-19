import { useAppSelector } from "@/app/store/store";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { isAuth } = useAppSelector((state) => state.auth);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};