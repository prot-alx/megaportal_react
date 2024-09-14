import React, { useState } from "react";
import {
  useCreateRequestMutation,
  RequestType,
} from "@/app/services/requestApi";
import { BaseDatePicker } from "@/shared/components/datepickers/basicDatePicker";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { RequestTypeSelectorNoId } from "@/shared/components/selectors/requestTypeSelector";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogTitle } from "@radix-ui/react-dialog";

const schema = z.object({
  clientNumber: z
    .string()
    .min(1, "Поле не должно быть пустым")
    .max(10, "Максимум 10 символов."),
  epNumber: z.string().max(10, "Максимум 10 символов.").optional(),
  description: z
    .string()
    .min(1, "Поле не должно быть пустым")
    .max(500, "Максимум 500 символов."),
  address: z
    .string()
    .min(1, "Поле не должно быть пустым")
    .max(100, "Максимум 100 символов."),
  phoneNumber: z
    .string()
    .min(1, "Поле не должно быть пустым")
    .max(20, "Максимум 20 символов."),
  date: z.date().optional(),
});

type FormValues = z.infer<typeof schema>;

export const RequestCreation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>(
    RequestType.Default
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientNumber: "",
      epNumber: "",
      description: "",
      address: "",
      phoneNumber: "+7-",
      date: new Date(),
    },
  });

  const currentDate = new Date();

  const [createRequest, { isLoading }] = useCreateRequestMutation();

  const openModal = () => {
    setIsOpen(true);
  };

  const handleAlertConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsAlertOpen(false);
    setRequestType(RequestType.Default);
    setValue("date", new Date());
  };

  const handleAlertCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAlertOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open === false && isOpen) {
      setIsAlertOpen(true);
    } else {
      setIsOpen(open);
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/\D/g, "");
    e.target.value = onlyNums;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");
    input = input.replace(/^7/, "");

    if (input.length > 3 && input.length <= 6) {
      input = `+7-${input.slice(0, 3)}-${input.slice(3)}`;
    } else if (input.length > 6 && input.length <= 10) {
      input = `+7-${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(6)}`;
    } else if (input.length > 10) {
      input = `+7-${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(
        6,
        10
      )}`;
    } else {
      input = `+7-${input}`;
    }

    setValue("phoneNumber", input);
  };

  const onSubmit = async (data: FormValues) => {
    if (!data.date) {
      console.error("Дата не выбрана.");
      return;
    }

    const requestDate = data.date.toISOString();

    const newRequest = {
      client_id: data.clientNumber.toString(),
      ep_id: data.epNumber ? data.epNumber.toString() : undefined,
      description: data.description,
      address: data.address,
      client_contacts: data.phoneNumber,
      request_date: requestDate,
      type: requestType,
    };

    try {
      await createRequest(newRequest).unwrap();
      reset();
      setIsOpen(false);
      setRequestType(RequestType.Default);
      setValue("date", new Date());
    } catch (error) {
      console.error("Ошибка при создании заявки:", error);
    }
  };

  const handleCancel = () => {
    setIsAlertOpen(true);
  };

  return (
    <div>
      <Button onClick={openModal}>Создать заявку</Button>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent aria-describedby="">
          <DialogTitle></DialogTitle>
          <Card className="w-[450px]">
            <CardHeader>
              <CardTitle>Создание заявки</CardTitle>
              <CardDescription>Заполните данные.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="request_creation"
                name="request_creation_form"
                onSubmit={handleSubmit(onSubmit)}
                className="grid w-full gap-4"
              >
                <Controller
                  name="clientNumber"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col space-y-1.5 relative pb-7">
                      <Label htmlFor="client">Номер абонента/прямая</Label>
                      <Input
                        id="client"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          handleNumberInput(e);
                          field.onChange(e);
                        }}
                        placeholder={"Введите номер абонента или номер прямой."}
                        className={errors.clientNumber ? "border-red-500" : ""}
                        autoComplete="off"
                      />
                      {errors.clientNumber && (
                        <p className="absolute text-red-500 text-sm mt-1 top-16">
                          {errors.clientNumber.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="epNumber"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col space-y-1.5 relative pb-7">
                      <Label htmlFor="ep">Номер ЕП</Label>
                      <Input
                        id="ep"
                        {...field}
                        onChange={(e) => {
                          handleNumberInput(e);
                          field.onChange(e);
                        }}
                        value={field.value ?? ""}
                        placeholder="Введите номер единичного повреждения."
                        autoComplete="off"
                      />
                      {errors.epNumber && (
                        <p className="absolute text-red-500 text-sm mt-1  top-16">
                          {errors.epNumber.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col space-y-1.5 relative pb-7">
                      <Label htmlFor="description">Описание повреждения</Label>
                      <Textarea
                        id="description"
                        {...field}
                        placeholder={"Введите описание повреждения."}
                        className={errors.description ? "border-red-500" : ""}
                        autoComplete="off"
                      />
                      {errors.description && (
                        <p className="absolute text-red-500 text-sm mt-1 top-[103px]">
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
                    <div className="flex flex-col space-y-1.5 relative pb-7">
                      <Label htmlFor="address">Адрес</Label>
                      <Input
                        id="address"
                        {...field}
                        placeholder={"Введите адрес абонента."}
                        className={errors.address ? "border-red-500" : ""}
                        autoComplete="off"
                      />
                      {errors.address && (
                        <p className="absolute text-red-500 text-sm mt-1  top-16">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col space-y-1.5 relative pb-7">
                      <Label htmlFor="contacts">
                        Контактный номер телефона
                      </Label>
                      <Input
                        id="contacts"
                        type="tel"
                        {...field}
                        onChange={(e) => handleInputChange(e)}
                        placeholder={"+7-___-___-____"}
                        className={errors.phoneNumber ? "border-red-500" : ""}
                        autoComplete="off"
                      />
                      {errors.phoneNumber && (
                        <p className="absolute text-red-500 text-sm mt-1  top-16">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <div className="flex gap-8 justify-between">
                  <div className="flex flex-col space-y-1.5 relative">
                    <p className="text-sm font-medium pb-4">Дата</p>
                    <BaseDatePicker
                      initialDate={
                        currentDate
                          ? format(currentDate, "dd-MM-yyyy", { locale: ru })
                          : undefined
                      }
                      onDateChange={(newDate) => {
                        if (newDate) {
                          setValue("date", newDate);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium pb-4">Тип</p>
                    <RequestTypeSelectorNoId
                      initialType={requestType}
                      onTypeChange={setRequestType}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" onClick={handleCancel}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={isLoading || isSubmitting}>
                    {isLoading ? "Создание..." : "Создать"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="w-[300px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Вы уверены, что хотите отменить создание заявки? Все несохраненные
            данные будут потеряны.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleAlertCancel}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAlertConfirm}>
              Подтвердить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};