import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useAuthRedirect = (isAuth: boolean) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuth) {
      const redirectTo = location.state?.prev_location || "/";
      navigate(redirectTo);
    }
  }, [isAuth, navigate, location.state?.prev_location]);
};
