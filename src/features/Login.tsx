import React, { useEffect, useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store/store";
import { useNavigate, useLocation, Form } from "react-router-dom";
import { loginAsync, clearError } from "@/app/store/auth/authSlice";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/shared/utils";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiLockFill,
  RiUserLine,
} from "@remixicon/react";
import {
  Button,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/shared/components";

const schema = z.object({
  login: z.string().min(1, "Поле обязательно"),
  password: z.string().min(1, "Поле обязательно"),
});

type FormData = z.infer<typeof schema>;

export const AuthForm: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error);

  const [passwordIsVisible, setPasswordIsVisible] = useState<boolean>(false);

  const togglePasswordVisible = () => setPasswordIsVisible(!passwordIsVisible);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    formState: { errors },
    handleSubmit,
    control,
  } = form;

  useEffect(() => {
    if (isAuth) {
      const redirectTo = location.state?.prev_location || "/";
      navigate(redirectTo);
    }
  }, [isAuth, navigate, location.state?.prev_location]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const onSubmit = useCallback(
    (data: FormData) => {
      dispatch(loginAsync(data));
    },
    [dispatch]
  );

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={control}
            name="login"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel htmlFor="login">Имя пользователя</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="login"
                      className={cn("pl-10 transition", {
                        "border-red-600 bg-red-100": errors.login,
                      })}
                      {...field}
                    />
                    <RiUserLine
                      size={16}
                      className="absolute left-3 top-3 fill-blue-700"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Пароль</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="password"
                      type={passwordIsVisible ? "text" : "password"}
                      className={cn("px-10 transition", {
                        "border-red-600 bg-red-100": errors.password,
                      })}
                      {...field}
                    />
                    <RiLockFill
                      size={16}
                      className="absolute left-3 top-3 fill-blue-700"
                    />
                    <RiEyeLine
                      size={16}
                      className={cn("absolute right-3 top-3 fill-blue-700", {
                        hidden: !passwordIsVisible,
                      })}
                      onClick={togglePasswordVisible}
                    />
                    <RiEyeOffLine
                      size={16}
                      className={cn("absolute right-3 top-3 fill-blue-700", {
                        hidden: passwordIsVisible,
                      })}
                      onClick={togglePasswordVisible}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isLoading ? "Загрузка..." : "Войти"}
          </Button>
        </form>
      </Form>

      {error && (
        <Alert
          className="text-red-800 w-[350px] pt-8"
          onClick={() => dispatch(clearError())}
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
