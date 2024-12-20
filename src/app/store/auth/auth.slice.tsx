import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, IUserMe } from "./types";
import { AuthError, initialState } from "./auth.interfaces";

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      if (action.payload) {
        const employeeData = action.payload;
        state.user = employeeData;
        state.user_role = employeeData.role;
        state.user_name = employeeData.name;
        state.isAuth = true;
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
      if (!state.isAuth) return;
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
        state.user_role = action.payload.role;
        state.user_name = action.payload.name;
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

export default authSlice.reducer;