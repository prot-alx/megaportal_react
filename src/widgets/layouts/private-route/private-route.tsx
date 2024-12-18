import { useAppSelector } from "@/app/store/store";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { isAuth, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <div></div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};
