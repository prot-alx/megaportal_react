import { useAppSelector } from "@/app/store/store";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { isAuth, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  console.log("isAuth:", isAuth);
  console.log("isLoading:", isLoading);

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
