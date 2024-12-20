import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/components";
import { RiUserLine } from "@remixicon/react";
import { cn } from "@/shared/utils";
import { ControllerRenderProps } from "react-hook-form";
import { AuthFormData } from "../../lib/schemas";

interface LoginFieldProps {
  field: ControllerRenderProps<AuthFormData, "login">;
  error?: boolean;
}

export const LoginField: React.FC<LoginFieldProps> = ({ field, error }) => {
  return (
    <FormItem>
      <FormLabel htmlFor="login">Имя пользователя</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            id="login"
            className={cn("pl-10 transition", {
              "border-red-600 bg-red-100": error,
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
  );
};
