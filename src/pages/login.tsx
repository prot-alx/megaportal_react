import React, { useEffect, useState } from "react";
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
import { loginAsync } from "@/app/store/auth/authSlice";

export const AuthForm: React.FC = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error);

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

  const onLoginClick = () => {
    dispatch(loginAsync({ login, password }));
  };

  return (
    <Card className="w-[400px] mx-auto">
      <CardHeader>
        <CardTitle>Авторизация</CardTitle>
        <CardDescription>Введите ваш логин и пароль.</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
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
          <div>Loading...</div>
        ) : (
          <Button onClick={onLoginClick}>Вход</Button>
        )}
        {error && <div>Error: {error}</div>}
      </CardFooter>
    </Card>
  );
};
