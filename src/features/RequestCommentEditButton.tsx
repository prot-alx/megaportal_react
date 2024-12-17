import { useState, useEffect, forwardRef } from "react";
import {
  Requests,
  RequestStatus,
  useUpdateRequestCommentMutation,
} from "@/app/services/requestApi";
import { useForm, Controller } from "react-hook-form";
import { RiAddBoxFill } from "@remixicon/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EmployeeSummaryDto } from "@/app/services/employeeApi";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  LoadingSpinner,
  Textarea,
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components";

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
  performer: EmployeeSummaryDto | null;
}

export const RequestCommentEdit = forwardRef<HTMLDivElement, RequestEditProps>(
  ({ request, requestStatus, performer }, ref) => {
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

    const statusTranslations: Record<RequestStatus, string> = {
      [RequestStatus.NEW]: "Новая",
      [RequestStatus.IN_PROGRESS]: "На исполнении",
      [RequestStatus.SUCCESS]: "На закрытии",
      [RequestStatus.CLOSED]: "Закрыта",
      [RequestStatus.CANCELLED]: "Отменена",
      [RequestStatus.MONITORING]: "На мониторинге",
      [RequestStatus.POSTPONED]: "Отложена",
    };

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
      if (typeof data.comment !== "string") {
        console.error("Комментарий должен быть строкой");
        return;
      }

      try {
        console.log("Данные для отправки:", data);
        console.log("ID заявки", request.id);
        const response = await updateComment({ id: request.id, data }).unwrap();
        console.log("Ответ сервера:", response);
        handleClose();
      } catch (error) {
        console.error("Ошибка при обновлении заявки:", JSON.stringify(error));
      }
    };

    // Если заявка закрыта или отменена, скрываем кнопку комментария
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
            <DialogTitle>
              Добавление комментария к заявке {request.client}
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full h-[30px]">
                Текущий статус заявки: {statusTranslations[request.status]}
              </span>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5 items-center gap-4">
                    <div className="flex justify-between gap-2">
                      <ToggleGroup type="single">
                        <ToggleGroupItem className="w-[115px]" value="a">
                          Закрыть
                        </ToggleGroupItem>
                        {performer !== null &&
                          requestStatus !== "NEW" &&
                          requestStatus !== "IN_PROGRESS" && (
                            <ToggleGroupItem className="w-[115px]" value="d">
                              В работу
                            </ToggleGroupItem>
                          )}
                        {performer !== null &&
                          requestStatus !== "MONITORING" && (
                            <ToggleGroupItem className="w-[115px]" value="b">
                              Мониторинг
                            </ToggleGroupItem>
                          )}
                        {requestStatus !== "POSTPONED" && (
                          <ToggleGroupItem className="w-[120px]" value="c">
                            В отложенные
                          </ToggleGroupItem>
                        )}
                      </ToggleGroup>
                    </div>
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
                  {isCommentLoading ? <LoadingSpinner /> : "Сохранить"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);
