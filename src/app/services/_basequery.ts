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
        withCredentials: true,
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
        withCredentials: true,
      };
      result = await axiosInstance(config);
    }
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;

    if (err.response?.status === 401) {
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
