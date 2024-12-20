import { AuthError } from "@/app/store/auth/auth.interfaces";
import { Alert, AlertTitle, AlertDescription } from "@/shared/components";

interface AuthErrorMessageProps {
  error: AuthError;
  onClose: () => void;
}

export const AuthErrorMessage: React.FC<AuthErrorMessageProps> = ({
  error,
  onClose,
}) => (
  <Alert className="text-red-800 w-[350px] pt-8" onClick={onClose}>
    <AlertTitle>{error.title}</AlertTitle>
    <AlertDescription>{error.error ?? "Неизвестная ошибка."}</AlertDescription>
  </Alert>
);
