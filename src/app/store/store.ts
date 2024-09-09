import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import authSlice from "./auth/authSlice";
import { requestsApi } from "../services/requestApi";
import { employeeApi } from "../services/employeeApi";
import requestSlice from "@/entities/slices/requestSlice";
import filterSlice from "@/entities/slices/filterSlice";

export const store = configureStore({
  reducer: {
    [requestsApi.reducerPath]: requestsApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    auth: authSlice,
    requests: requestSlice,
    filters: filterSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(requestsApi.middleware, employeeApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
