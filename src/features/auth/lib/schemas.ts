import { z } from "zod";

export const authFormSchema = z.object({
  login: z.string().min(1, "Поле обязательно"),
  password: z.string().min(1, "Поле обязательно"),
});

export type AuthFormData = z.infer<typeof authFormSchema>;
