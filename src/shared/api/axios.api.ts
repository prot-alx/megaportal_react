import { AuthService } from "@/app/store/auth/auth.service";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        // Если нет refresh токена или он истек, выполнить логаут
        if (!refreshToken || AuthService.isTokenExpired(refreshToken)) {
          AuthService.logout();
          return Promise.reject(
            new Error("Refresh token expired. Logging out...")
          );
        }

        // Попробовать обновить токен
        const refreshedData = await AuthService.refreshToken();
        if (refreshedData) {
          localStorage.setItem("access_token", refreshedData.access_token);
          localStorage.setItem("refresh_token", refreshedData.refresh_token);

          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${refreshedData.access_token}`;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${refreshedData.access_token}`;

          return axiosInstance(originalRequest);
        }
      } catch (err) {
        AuthService.logout();
        return Promise.reject(
          err instanceof Error ? err : new Error(String(err))
        );
      }
    }

    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

export default axiosInstance;
