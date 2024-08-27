export const baseURL: string = "http://localhost:3333/";

export const loginURL: string = "auth/login";

export const checkAuthURL: string = "auth/checkauth";

export const  refreshTokenURL : string = "auth/refresh";

export const headers = {
  Authorization: "Bearer " + localStorage.getItem("access_token"),
  "Content-Type": "application/x-www-form-urlencoded",
};
