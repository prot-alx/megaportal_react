import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { requestsApi } from "../services/request.api";
import { employeeApi } from "../services/employee.api";
import authSlice from "./auth/auth.slice";
import { socketMiddleware } from "./middleware/socket.middleware";

export const store = configureStore({
  reducer: {
    [requestsApi.reducerPath]: requestsApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(requestsApi.middleware, employeeApi.middleware)
      .concat(socketMiddleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
