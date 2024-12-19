import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthService } from "./auth.service";
import { RootState, AppDispatch, store } from "../store";
import { IUserData, IUserMe, IUser } from "./types";
import { AxiosError } from "axios";

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
  isCheckingAuth: boolean;
  error: AuthError | null;
}

const initialState: IUserState = {
  user: null,
  user_role: null,
  user_name: null,
  isAuth: false,
  isLoading: false,
  isCheckingAuth: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      console.log("SetUser action payload:", action.payload);

      if (action.payload) {
        const employeeData = action.payload;
        state.user = employeeData;
        state.user_role = employeeData.role;
        state.user_name = employeeData.name;
        state.isAuth = true;
        console.log("Состояние пользователя обновлено:", {
          user: state.user,
          role: state.user_role,
          name: state.user_name,
          isAuth: state.isAuth,
        });
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
      console.log("Выполняется logout...");
      if (!state.isAuth) return;
      AuthService.logout(); // Очистка cookies
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
        state.user_role = action.payload.role;    // берем напрямую из данных
        state.user_name = action.payload.name;    // берем напрямую из данных
        state.isLoading = false;
      }
    },
    startCheckingAuth: (state) => {
      state.isCheckingAuth = true;
    },
    endCheckingAuth: (state) => {
      state.isCheckingAuth = false;
    },
  },
});

export const {
  logout,
  setUser,
  setError,
  clearError,
  setIsLoading,
  refresh,
  startCheckingAuth,
  endCheckingAuth,
} = authSlice.actions;

export const loginAsync =
  (userData: IUserData) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsLoading(true));
      const data = await AuthService.login(userData.login, userData.password);
      console.log("Login data received:", data);
      if (data) {
        dispatch(setUser(data));
        const currentState = store.getState().auth;
        console.log("Current auth state:", currentState);
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
        console.log(error.code);
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
