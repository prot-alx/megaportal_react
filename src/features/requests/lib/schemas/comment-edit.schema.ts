import { z } from "zod";

export const commentEditSchema = z.object({
  comment: z
    .string()
    .min(1, "Поле не должно быть пустым")
    .max(500, "Максимум 500 символов."),
});

export type CommentEditFormValues = z.infer<typeof commentEditSchema>;
