import { EmployeeSummaryDto } from "@/app/services/employeeApi";
import {
  Requests,
  RequestType,
  useCancelRequestMutation,
  useGetPerformersByRequestIdQuery,
  useUpdateRequestDateMutation,
  useUpdateRequestTypeMutation,
} from "@/app/services/requestApi";
import { RequestDatePicker } from "@/shared/components/datepickers/requestDatePicker";
import { EmployeeSelector } from "@/shared/components/selectors/employeeSelector";
import { RequestTypeSelector } from "@/shared/components/selectors/requestChangeTypeSelector";
import { LoadingSpinner } from "@/shared/components/ui/preloader";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { format } from "date-fns";
import { RiCloseLargeFill } from "@remixicon/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useCallback, useState } from "react";
import { RequestEdit } from "@/features/RequestEdit";
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

interface RequestTableRowProps {
  request: Requests;
  employees: EmployeeSummaryDto[] | undefined;
  isChecked: boolean;
  onSelect: (employee: EmployeeSummaryDto | null) => void;
  onCheckboxChange: (requestId: number) => void;
}

export const RequestTableRow: React.FC<RequestTableRowProps> = ({
  request,
  employees = [],
  onSelect,
}) => {
  const [
    updateRequestDate,
    { isLoading: isDateLoading, isError: isDateError },
  ] = useUpdateRequestDateMutation();
  const [
    updateRequestType,
    { isLoading: isTypeLoading, isError: isTypeError },
  ] = useUpdateRequestTypeMutation();
  const [
    cancelRequest,
    { isLoading: isCancelLoading, isError: isCancelError },
  ] = useCancelRequestMutation();
  const {
    data: performers,
    isLoading: isPerformersLoading,
    error: performersError,
  } = useGetPerformersByRequestIdQuery(request.id);

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleUpdateRequestDate = useCallback(
    async (id: number, newDate: string) => {
      try {
        const response = await updateRequestDate({
          id,
          new_request_date: newDate,
        }).unwrap();
        console.log("Request date updated:", response);
      } catch (error) {
        console.error("Failed to update request date:", error);
      }
    },
    [updateRequestDate]
  );

  const handleUpdateRequestType = useCallback(
    async (id: number, newType: RequestType) => {
      try {
        const response = await updateRequestType({
          id,
          new_type: newType,
        }).unwrap();
        console.log("Request type updated:", response);
      } catch (error) {
        console.error("Failed to update request type:", error);
      }
    },
    [updateRequestType]
  );

  const handleCancelRequest = async (id: number) => {
    try {
      await cancelRequest(id).unwrap();
      console.log("Request cancelled:", id);
    } catch (error) {
      console.error("Failed to cancel request:", error);
    }
  };

  const handleAlertCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAlertOpen(false);
  };

  const handleAlertConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAlertOpen(false);
    handleCancelRequest(request.id);
  };

  return (
    <TableRow
      key={request.id}
      className="block xl:table-row border-t border-gray-200 group"
    >
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Абонент: </span>
        {request.client_id}
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">ЕП: </span>
        {request.ep_id}
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Описание: </span>
        {request.description}
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Адрес: </span>
        {request.address}
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Контакты: </span>
        <a className="xl:hidden" href={`tel:${request.client_contacts}`}>
          {request.client_contacts}
        </a>
        <span className="hidden xl:inline">{request.client_contacts}</span>
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Дата выезда: </span>
        {isDateLoading && <LoadingSpinner />}
        {!isDateLoading && isDateError && (
          <div className="text-red-500">Ошибка при обновлении даты</div>
        )}
        {!isDateLoading && !isDateError && (
          <RequestDatePicker
            id={request.id}
            initialDate={request.request_date}
            onDateChange={(id, date) =>
              handleUpdateRequestDate(id, format(date, "yyyy-MM-dd"))
            }
          />
        )}
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Тип: </span>
        {isTypeLoading && <LoadingSpinner />}
        {!isTypeLoading && isTypeError && (
          <div className="text-red-500">Ошибка при обновлении типа</div>
        )}
        {!isTypeLoading && !isTypeError && (
          <RequestTypeSelector
            requestId={request.id}
            initialType={request.type}
            onTypeChange={handleUpdateRequestType}
          />
        )}
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Назначение: </span>
        <div className="flex flex-col gap-3">
          {/* Показать загрузку, пока данные загружаются */}
          {isPerformersLoading && <LoadingSpinner />}

          {/* Показать селектор без исполнителя, если есть ошибка или исполнители не назначены */}
          {!isPerformersLoading &&
            (performersError || !performers || performers.length === 0) && (
              <EmployeeSelector
                requestID={request.id}
                employees={employees}
                onSelect={onSelect}
                selectorText="Выберите исполнителя..."
              />
            )}

          {/* Показать селекторы для исполнителей, если они есть */}
          {!isPerformersLoading &&
            performers &&
            performers.length > 0 &&
            performers.map((performer: EmployeeSummaryDto) => (
              <EmployeeSelector
                key={performer.id}
                requestID={request.id}
                employees={employees}
                initialSelectedEmployee={performer}
                onSelect={onSelect}
                selectorText="Выберите исполнителя..."
              />
            ))}
        </div>
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Комментарий: </span>
        {request.comment}asdasd ad asas as asas aasas as asdas asd asd asd 2qe
        12 12e 12e 12
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Редактировать: </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <RequestEdit request={request} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Редактировать</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">
          Закрыть отказом/отменить:{" "}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {!isCancelLoading && !isCancelError && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsAlertOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault(); // предотвращает прокрутку при нажатии пробела
                      handleCancelRequest(request.id);
                    }
                  }}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-2 hover:bg-red-400 opacity-10 hover:opacity-90"
                >
                  <RiCloseLargeFill
                    size="30px"
                    color="black"
                    className="min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px]"
                  />
                </div>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Отменить заявку</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent className="w-[300px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Подтверждение</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Вы уверены, что хотите отменить заявку? Это действие необратимо.
            </AlertDialogDescription>
            <AlertDialogFooter className="gap-10">
              <AlertDialogCancel onClick={handleAlertCancel}>
                Отмена
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleAlertConfirm}>
                Подтвердить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};
