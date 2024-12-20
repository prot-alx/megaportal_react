import { AppDispatch } from "../store";
import { AuthService } from "./auth.service";
import { IUserData } from "./types";
import { AxiosError } from "axios";
import { setError, setIsLoading, setUser } from "./auth.slice";

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
