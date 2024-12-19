import {
  checkAuthURL,
  loginURL,
  refreshTokenURL,
} from "@/shared/constants/api";
import { IUser, IUserMe, IUserMeResponse } from "./types";
import axiosInstance from "@/shared/api/axios.api";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// Константы для названий cookies
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Настройки cookies
const COOKIE_OPTIONS = {
  secure: true, // Только для HTTPS
  sameSite: "strict" as const, // Защита от CSRF
  path: "/", // Доступно для всего сайта
};

interface RefreshResponse {
  user: IUserMe;
  message: string;
}

export const AuthService = {
  async login(login: string, password: string): Promise<IUser | undefined> {
    try {
      const response = await axiosInstance.post<IUser>(loginURL, {
        login,
        password,
      });
      console.log('Login response:', response.data);
      // Сохраняем токены в cookies
      Cookies.set(ACCESS_TOKEN_KEY, response.data.access_token, COOKIE_OPTIONS);
      Cookies.set(
        REFRESH_TOKEN_KEY,
        response.data.refresh_token,
        COOKIE_OPTIONS
      );

      // Устанавливаем токен для axios
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;

      // Проверяем cookies сразу после ответа
      console.log('Cookies after login:', document.cookie);

      return response.data;
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      throw error;
    }
  },

  async getMe(): Promise<IUserMe | undefined> {
    try {
      const response = await axiosInstance.get<IUserMeResponse>(checkAuthURL);
      console.log('Response.data: ', response.data);
      return response.data.user; // обратите внимание, что данные в .user
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
      throw error;
    }
  },

  isTokenExpired(token: string): boolean {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      if (!exp) {
        return true;
      }
      return Date.now() >= exp * 1000;
    } catch (error) {
      console.error("Ошибка при проверке токена:", error);
      return true;
    }
  },

  async refreshToken(): Promise<IUserMe | undefined> {
    console.log('Starting token refresh');
    try {
      const response = await axiosInstance.post<RefreshResponse>(refreshTokenURL);
      console.log('Refresh successful:', response.data);
      
      // Возвращаем данные пользователя
      return response.data.user;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async logout() {
    try {
      // Делаем запрос на сервер для очистки cookies
      await axiosInstance.post('auth/logout');
      // Очищаем заголовок авторизации
      axiosInstance.defaults.headers.common["Authorization"] = "";
      // Редирект на страницу логина
      window.location.href = "/login";
    } catch (error) {
      console.error('Logout error:', error);
      // Даже если произошла ошибка, всё равно редиректим на логин
      window.location.href = "/login";
    }
  }
};
