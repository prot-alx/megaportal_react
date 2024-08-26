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
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized, attempt to refresh
      try {
        const refreshedData = await AuthService.refreshToken();
        if (refreshedData) {
          return axiosInstance.request(error.config); // Retry the failed request
        }
      } catch (refreshError) {
        // Handle refresh token error (logout, etc.)
        console.log(refreshError);
        AuthService.logout();
      }
    }
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

export default axiosInstance;
