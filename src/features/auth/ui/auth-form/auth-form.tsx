import { useEffect, useCallback } from "react";
import { Form, FormField, Button } from "@/shared/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector, useAppDispatch } from "@/app/store/store";
import { loginAsync } from "@/app/store/auth/auth.thunks";
import { clearError } from "@/app/store/auth/auth.slice";
import { PasswordField } from "../auth-form-fields/password-field";
import { AuthFormData, authFormSchema } from "../../lib/schemas";
import { useAuthRedirect } from "../../lib/hooks/useAuthRedirect";
import { AuthErrorMessage } from "../auth-error";
import { LoginField } from "../auth-form-fields/login-field";

export const AuthForm = () => {
  const dispatch = useAppDispatch();
  const { isAuth, isLoading, error } = useAppSelector((state) => state.auth);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  useAuthRedirect(isAuth);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const onSubmit = useCallback(
    (data: AuthFormData) => {
      dispatch(loginAsync(data));
    },
    [dispatch]
  );

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <LoginField field={field} error={!!form.formState.errors.login} />
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <PasswordField
                field={field}
                error={!!form.formState.errors.password}
              />
            )}
          />
          <Button type="submit" className="w-full">
            {isLoading ? "Загрузка..." : "Войти"}
          </Button>
        </form>
      </Form>

      {error && (
        <AuthErrorMessage
          error={error}
          onClose={() => dispatch(clearError())}
        />
      )}
    </div>
  );
};
