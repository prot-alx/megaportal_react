import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/components";
import { RiEyeLine, RiEyeOffLine, RiLockFill } from "@remixicon/react";
import { useState } from "react";
import { cn } from "@/shared/utils";
import { ControllerRenderProps } from "react-hook-form";
import { AuthFormData } from "../../lib/schemas";

interface PasswordFieldProps {
  field: ControllerRenderProps<AuthFormData, "password">;
  error?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  field,
  error,
}) => {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  return (
    <FormItem>
      <FormLabel htmlFor="password">Пароль</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            id="password"
            type={passwordIsVisible ? "text" : "password"}
            className={cn("px-10 transition", {
              "border-red-600 bg-red-100": error,
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
            onClick={() => setPasswordIsVisible(!passwordIsVisible)}
          />
          <RiEyeOffLine
            size={16}
            className={cn("absolute right-3 top-3 fill-blue-700", {
              hidden: passwordIsVisible,
            })}
            onClick={() => setPasswordIsVisible(!passwordIsVisible)}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
