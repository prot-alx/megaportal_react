import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthService } from "./auth.service";
import { RootState, AppDispatch } from "../store";
import { IUserData, IUserMe, IUser } from "./types";

interface ApiError {
  statusCode: number;
  message: string;
  details?: string;
  timestamp?: string;
  path?: string;
}

export const loginAsync =
  (userData: IUserData) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setIsLoading(true));
      const data = await AuthService.login(userData.login, userData.password);

      if (data) {
        dispatch(login(data));
      } else {
        dispatch(setError("Ошибка авторизации"));
      }

      dispatch(setIsLoading(false));
    } catch (error) {
      // Определяем тип ошибки
      if (error instanceof Error) {
        dispatch(setError(error.message));
      } else if ((error as ApiError).message) {
        dispatch(setError((error as ApiError).message));
      } else {
        dispatch(setError("Неизвестная ошибка"));
      }
      dispatch(setIsLoading(false));
    }
  };

interface IUserState {
  user: IUserMe | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: IUserState = {
  user: null,
  isAuth: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IUser>) => {
      if (action.payload?.token) {
        localStorage.setItem("jwt_token", action.payload.token);
        state.user = action.payload;
        state.isAuth = true;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("jwt_token");
      state.isAuth = false;
      state.user = null;
    },
    refresh: (state, action: PayloadAction<IUserMe>) => {
      if (action.payload) {
        state.isAuth = true;
        state.user = action.payload;
      }
    },
  },
});

export const { logout, login, setError, setIsLoading, refresh } =
  authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
