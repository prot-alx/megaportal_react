import { store } from "../store";
import { AuthService } from "./auth.service";
import {
  refresh,
  logout,
} from "./auth.slice";

export const checkAuth = async () => {
  try {
    const userData = await AuthService.getMe();
    if (userData) {
      store.dispatch(refresh(userData));
      return true;
    } else {
      store.dispatch(logout());
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return false;
    }
  } catch (error) {
    console.error("CheckAuth error:", error);
    store.dispatch(logout());
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return false;
  }
};