import { IUserMe } from "./types";

export interface AuthError {
  title: string;
  error: string | null;
}

export interface IUserState {
  user: IUserMe | null;
  user_role: string | null;
  user_name: string | null;
  isAuth: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: AuthError | null;
}

export const initialState: IUserState = {
  user: null,
  user_role: null,
  user_name: null,
  isAuth: false,
  isLoading: false,
  isCheckingAuth: false,
  error: null,
};
