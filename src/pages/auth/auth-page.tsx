import { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared";
import { Separator } from "@radix-ui/react-select";
import { AuthForm } from "@/features";

const AuthPage: FC = () => {
  return (
    <main className="min-h-screen text-gray-800">
      <Card className="w-[400px] h-[350px] md:w-[400px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <CardHeader>
          <CardTitle className="md:text-center">Авторизация</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <AuthForm />
        </CardContent>
      </Card>
    </main>
  );
};

export { AuthPage };
