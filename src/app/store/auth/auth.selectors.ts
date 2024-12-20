import { RootState } from "../store";

export const selectAuth = (state: RootState) => state.auth;
export const selectUserRole = (state: RootState) => state.auth.user_role;
export const selectUserName = (state: RootState) => state.auth.user_name;
