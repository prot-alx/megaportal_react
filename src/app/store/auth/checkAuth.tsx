import { store } from "../store";
import { AuthService } from "./auth.service";
import { refresh, logout } from "./authSlice";
import { jwtDecode } from "jwt-decode";

export const checkAuth = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    console.log("Токен отсутствует");
    store.dispatch(logout());
    return;
  }

  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    const isTokenExpired = decodedToken.exp * 1000 < Date.now();

    if (isTokenExpired) {
      console.log("Токен истек, попытка обновить...");
      const refreshedData = await AuthService.refreshToken();
      if (!refreshedData) {
        console.log("Обновление токена не удалось, разлогинивание...");
        store.dispatch(logout());
        return;
      }
      localStorage.setItem("access_token", refreshedData.access_token);
    }

    const userData = await AuthService.getMe();
    if (userData) {
      console.log("Данные пользователя успешно получены:", userData);
      store.dispatch(refresh(userData));
    } else {
      console.log("Не удалось получить данные пользователя, разлогинивание...");
      store.dispatch(logout());
    }
  } catch (error) {
    console.log("Ошибка при проверке аутентификации:", error);
    store.dispatch(logout());
  }
};
