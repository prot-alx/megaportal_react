import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { RiAddBoxFill } from "@remixicon/react";
import { useState, useEffect, forwardRef } from "react";
import {
  Requests,
  useUpdateRequestCommentMutation,
} from "@/app/services/requestApi";
import { Label } from "@/shared/components/ui/label";
import { LoadingSpinner } from "@/shared/components/ui/preloader";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  comment: z
    .string()
    .min(1, "Поле не должно быть пустым")
    .max(500, "Максимум 500 символов."),
});

type FormValues = z.infer<typeof schema>;

interface RequestEditProps {
  request: Requests;
  requestStatus: string;
}

export const RequestCommentEdit = forwardRef<HTMLDivElement, RequestEditProps>(
  ({ request, requestStatus }, ref) => {

    const [isOpen, setIsOpen] = useState(false);

    const {
      control,
      handleSubmit,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        comment: "",
      },
    });

    const [updateComment, { isLoading: isCommentLoading }] =
      useUpdateRequestCommentMutation();

    useEffect(() => {
      if (isOpen) {
        setValue("comment", "");
      }
    }, [isOpen, request, setValue]);

    const openModal = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const onSubmit = async (data: FormValues) => {
      if (typeof data.comment !== 'string') {
        console.error("Комментарий должен быть строкой");
        return;
      }
    
      try {
        console.log("Данные для отправки:", data);
        console.log("ID заявки", request.id)
        const response = await updateComment({ id: request.id, data }).unwrap();
        console.log("Ответ сервера:", response);
        handleClose();
      } catch (error) {
        console.error("Ошибка при обновлении заявки:", JSON.stringify(error));
      }
    };

    // Если заявка закрыта или отменена, скрываем кнопку редактирования
    if (requestStatus === "CLOSED" || requestStatus === "CANCELLED") {
      return null;
    }

    return (
      <div ref={ref}>
        <Button
          role="button"
          variant="outline"
          className="w-[40px] opacity-20 hover:opacity-100"
          onClick={openModal}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openModal();
            }
          }}
        >
          <RiAddBoxFill className="ml-auto min-h-6 min-w-6" />
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent aria-describedby="">
            <DialogTitle>Добавление комментария</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">              
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="comment">Комментарий</Label>
                    <Textarea
                      id="comment"
                      {...field}
                      placeholder="Введите комментарий."
                      className={errors.comment ? "border-red-500" : ""}
                      autoComplete="off"
                    />
                    {errors.comment && (
                      <p className="text-red-500 text-sm mt-1"></p>
                    )}
                  </div>
                )}
              />
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  className="w-28"
                  onClick={handleClose}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className="w-28"
                  disabled={isCommentLoading || isSubmitting}
                >
                  {isCommentLoading ? <LoadingSpinner /> : "Добавить"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);
