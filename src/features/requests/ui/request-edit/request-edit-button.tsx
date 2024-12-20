import { useState, useEffect, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Requests, useUpdateRequestMutation } from "@/app/services/request.api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  Textarea,
  Button,
  Label,
  LoadingSpinner,
} from "@/shared";
import { RiEditLine } from "@remixicon/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CancelRequestButton } from "@/features";

// Определение схемы валидации с помощью zod
const schema = z.object({
  client_id: z.string().min(1, "Поле не должно быть пустым"),
  ep_id: z.string().optional(),
  description: z
    .string()
    .min(1, "Поле не должно быть пустым")
    .max(500, "Максимум 500 символов."),
  address: z
    .string()
    .min(1, "Поле не должно быть пустым")
    .max(100, "Максимум 100 символов."),
  client_contacts: z
    .string()
    .min(1, "Поле не должно быть пустым")
    .max(20, "Максимум 20 символов."),
});

type FormValues = z.infer<typeof schema>;

interface RequestEditProps {
  request: Requests;
  requestStatus: string;
}

export const RequestEdit = forwardRef<HTMLDivElement, RequestEditProps>(
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
        client_id: "",
        ep_id: "",
        description: "",
        address: "",
        client_contacts: "",
      },
    });

    // Функция для форматирования номера телефона
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value.replace(/\D/g, "");
      input = input.replace(/^7/, "");

      if (input.length > 3 && input.length <= 6) {
        input = `+7-${input.slice(0, 3)}-${input.slice(3)}`;
      } else if (input.length > 6 && input.length <= 10) {
        input = `+7-${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(
          6
        )}`;
      } else if (input.length > 10) {
        input = `+7-${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(
          6,
          10
        )}`;
      } else {
        input = `+7-${input}`;
      }

      setValue("client_contacts", input);
    };

    const [updateRequest, { isLoading }] = useUpdateRequestMutation();

    useEffect(() => {
      if (isOpen) {
        setValue("client_id", request.client ?? "");
        setValue("ep_id", request.ep_id ?? "");
        setValue("description", request.description ?? "");
        setValue("address", request.address ?? "");
        setValue("client_contacts", request.contacts ?? "");
      }
    }, [isOpen, request, setValue]);

    const openModal = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const onSubmit = async (data: FormValues) => {
      try {
        await updateRequest({ id: request.id, data }).unwrap();
        handleClose();
      } catch (error) {
        console.error("Ошибка при обновлении заявки:", error);
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
          <RiEditLine className="ml-auto min-h-6 min-w-6" />
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent aria-describedby="">
            <DialogTitle>Редактирование заявки</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="client_id"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="client_id">Номер абонента/прямая</Label>
                    <Input
                      id="client_id"
                      {...field}
                      placeholder="Введите номер абонента или номер прямой."
                      className={errors.client_id ? "border-red-500" : ""}
                      autoComplete="off"
                      disabled
                    />
                    {errors.client_id && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.client_id.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="ep_id"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="ep_id">Номер ЕП</Label>
                    <Input
                      id="ep_id"
                      {...field}
                      placeholder="Введите номер ЕП."
                      className={errors.ep_id ? "border-red-500" : ""}
                      autoComplete="off"
                      disabled
                    />
                    {errors.ep_id && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.ep_id.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="description">Описание повреждения</Label>
                    <Textarea
                      id="description"
                      {...field}
                      placeholder="Введите описание повреждения."
                      className={errors.description ? "border-red-500" : ""}
                      autoComplete="off"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="address">Адрес</Label>
                    <Input
                      id="address"
                      {...field}
                      placeholder="Введите адрес."
                      className={errors.address ? "border-red-500" : ""}
                      autoComplete="off"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="client_contacts"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="client_contacts">
                      Контактный номер телефона
                    </Label>
                    <Input
                      id="client_contacts"
                      {...field}
                      placeholder="Введите контактный номер телефона."
                      className={errors.client_contacts ? "border-red-500" : ""}
                      autoComplete="off"
                      onChange={handleInputChange}
                    />
                    {errors.client_contacts && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.client_contacts.message}
                      </p>
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
                <CancelRequestButton requestId={request.id} />
                <Button
                  type="submit"
                  className="w-28"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? <LoadingSpinner /> : "Изменить"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);
