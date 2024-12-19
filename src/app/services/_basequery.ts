import axiosInstance from "@/shared/api/axios.api";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosRequestConfig, AxiosError } from "axios";

export const baseQuery: BaseQueryFn<
  string | AxiosRequestConfig,
  unknown,
  unknown
> = async (args) => {
  try {
    let result;
    if (typeof args === "string") {
      result = await axiosInstance.get(args, {
        withCredentials: true, // добавляем для строковых запросов
      });
    } else {
      const { url, method, data, headers } = args;
      const config: AxiosRequestConfig = {
        url,
        method,
        headers: {
          ...(headers || {}),
          "Content-Type": "application/json",
        },
        data,
        withCredentials: true, // добавляем для объектных запросов
      };
      result = await axiosInstance(config);
    }
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;

    // Добавляем обработку 401 ошибки
    if (err.response?.status === 401) {
      // Можно добавить редирект на логин или обновление токена
      window.location.href = "/login";
    }

    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};
