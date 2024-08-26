import axiosInstance from "@/shared/api/axios.api";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosRequestConfig, AxiosError } from "axios";

export const baseQuery: BaseQueryFn<
  string | AxiosRequestConfig,
  unknown,
  unknown
> = async (args) => {
  // Получаем токен из localStorage
  const accessToken = localStorage.getItem("access_token");

  try {
    // Устанавливаем токен в заголовки
    const result =
      typeof args === "string"
        ? await axiosInstance.get(args, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
        : await axiosInstance({
            ...args,
            headers: {
              ...args.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          });

    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;

    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};
