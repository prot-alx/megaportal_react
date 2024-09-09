import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthService } from "./auth.service";
import { RootState, AppDispatch } from "../store";
import { IUserData, IUserMe, IUser } from "./types";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

interface AuthError {
  title: string;
  error: string | null;
}

interface IUserState {
  user: IUserMe | null;
  user_role: string | null;
  user_name: string | null;
  isAuth: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

const initialState: IUserState = {
  user: null,
  user_role: null,
  user_name: null,
  isAuth: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      if (action.payload?.access_token) {        
        localStorage.setItem("access_token", action.payload.access_token);
        localStorage.setItem("refresh_token", action.payload.refresh_token);

        const decodedToken = jwtDecode<{ name: string; role: string }>(
          action.payload.access_token
        );

        state.user = action.payload;
        state.user_role = decodedToken.role;
        state.user_name = decodedToken.name;
        state.isAuth = true;

        console.log("Состояние пользователя обновлено:", state);
      }
    },
    setError: (state, action: PayloadAction<AuthError>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      console.log("Выполняется logout, удаление токена...");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      state.isAuth = false;
      state.user = null;
      state.user_role = null;
      state.user_name = null;
    },
    refresh: (state, action: PayloadAction<IUserMe>) => {
      state.isLoading = true;
      if (action.payload) {
        state.isAuth = true;
        state.user = action.payload;

        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const decodedToken = jwtDecode<{ name: string; role: string }>(
            accessToken
          );
          state.user_role = decodedToken.role;
          state.user_name = decodedToken.name;
        }
        state.isLoading = false;
      }
    },
  },  
});

export const { logout, setUser, setError, clearError, setIsLoading, refresh } =
  authSlice.actions;

export const loginAsync =
  (userData: IUserData) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsLoading(true));
      const data = await AuthService.login(userData.login, userData.password);

      if (data) {
        dispatch(setUser(data));
      } else {
        dispatch(
          setError({
            title: "Ошибка авторизации",
            error: "Не удалось авторизоваться",
          })
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.code)
        const title = error.response?.data?.message || "Неизвестная ошибка";
        const errorDetails = error.response?.data?.details || error.code;

        dispatch(setError({ title, error: errorDetails }));
      } else if (error instanceof Error) {
        dispatch(setError({ title: "Ошибка", error: error.message }));
      } else {
        dispatch(
          setError({
            title: "Неизвестная ошибка",
            error: "Произошла неизвестная ошибка",
          })
        );
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };

export const selectAuth = (state: RootState) => state.auth;
export const selectUserRole = (state: RootState) => state.auth.user_role;
export const selectUserName = (state: RootState) => state.auth.user_name;

export default authSlice.reducer;
