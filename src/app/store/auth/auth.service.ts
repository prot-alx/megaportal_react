import {
  checkAuthURL,
  loginURL,
  refreshTokenURL,
} from "@/shared/constants/api";
import { IUser, IUserMe } from "./types";
import axiosInstance from "@/shared/api/axios.api";

export const AuthService = {
  async login(login: string, password: string): Promise<IUser | undefined> {
    try {
      const response = await axiosInstance.post<IUser>(loginURL, {
        login,
        password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;
      return response.data;
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      throw error;
    }
  },

  async getMe(): Promise<IUserMe | undefined> {
    try {
      const response = await axiosInstance.get<IUserMe>(checkAuthURL);
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
      throw error;
    }
  },

  async refreshToken(): Promise<IUser | undefined> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      this.logout();
      return undefined;
    }

    try {
      const response = await axiosInstance.post<IUser>(refreshTokenURL, {
        refresh_token: refreshToken,
      });
      //localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;
      return response.data;
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      this.logout();
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    axiosInstance.defaults.headers.common["Authorization"] = "";
    window.location.href = "/login";
  },
};
