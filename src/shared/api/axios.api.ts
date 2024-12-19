import { AuthService } from "@/app/store/auth/auth.service";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Оставляем только один интерцептор для логирования
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request config:", {
      url: config.url,
      method: config.method,
    });
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

    // Проверяем, что:
    // 1. Это 401 ошибка
    // 2. У запроса еще не было попытки обновления
    // 3. Это не сам запрос на обновление токена
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      originalRequest.url !== 'auth/refresh'  // Важное условие!
    ) {
      console.log('Attempting to refresh token...');
      originalRequest._retry = true;

      try {
        await AuthService.refreshToken();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Если не удалось обновить токен - делаем логаут
        console.error('Token refresh failed:', refreshError);
        AuthService.logout();
        return Promise.reject(refreshError);
      }
    }

    // Для всех остальных ошибок или если refresh token тоже протух
    return Promise.reject(error);
  }
);

export default axiosInstance;
