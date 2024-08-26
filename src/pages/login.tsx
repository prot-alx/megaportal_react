import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useAppSelector, useAppDispatch } from "@/app/store/store";
import { useNavigate, useLocation } from "react-router-dom";
import { loginAsync, clearError } from "@/app/store/auth/authSlice";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";

export const AuthForm: React.FC = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error);

  const [showAlert, setShowAlert] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    if (isAuth) {
      if (location.state?.prev_location) {
        navigate(location.state.prev_location);
      } else {
        navigate("/");
      }
    }
  }, [isAuth, navigate, location.state?.prev_location]);

  useEffect(() => {
    if (error) {
      setShowAlert(true);
      console.log("set to True");

      const timer = setTimeout(() => {
        setShowAlert(false);
        console.log("set to False");
        dispatch(clearError()); // Очищаем ошибку в Redux, чтобы она могла быть установлена снова при повторном возникновении
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Оборачиваем onLoginClick в useCallback
  const onLoginClick = useCallback(() => {
    dispatch(loginAsync({ login, password }));
  }, [dispatch, login, password]);

  const handleAlertClick = () => {
    setShowAlert(false);
    console.log("set to False");
    dispatch(clearError()); // Очищаем ошибку при клике на алерт
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onLoginClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onLoginClick]); // Обновляем зависимости

  return (
    <div className="w-[400px] mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Авторизация</CardTitle>
          <CardDescription>Введите ваш логин и пароль.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-4">
            <Label htmlFor="login">Логин</Label>
            <Input
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          {isLoading ? (
            <Button className="w-[400px] mx-auto">Загрузка...</Button>
          ) : (
            <Button className="w-[400px] mx-auto" onClick={onLoginClick}>
              Вход
            </Button>
          )}
        </CardFooter>
      </Card>
      {showAlert && error && (
        <Alert
          className="text-red-800 w-[400px] pt-8"
          onClick={handleAlertClick}
        >
          <AlertTitle>{error.title}</AlertTitle>
          <AlertDescription>
            {error.error ?? "Неизвестная ошибка."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
