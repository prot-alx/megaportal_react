import { EmployeeSummaryDto } from "@/app/services/employeeApi";
import {
  Requests,
  RequestType,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useCallback } from "react";
import { RequestEdit } from "@/features/RequestEditButton";

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
  const {
    data: performers,
    isLoading: isPerformersLoading,
    error: performersError,
  } = useGetPerformersByRequestIdQuery(request.id);

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

  return (
    <TableRow
      key={request.id}
      className="block xl:table-row border-y-2 border-gray-300 group"
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
      <TableCell className="block xl:table-cell py-2 min-w-[145px]">
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
            requestStatus={request.status}
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
            requestStatus={request.status}
          />
        )}
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Назначение: </span>
        <div className="flex flex-col gap-3">

          {isPerformersLoading && <LoadingSpinner />}

          {/* Показать селектор без исполнителя, если есть ошибка или исполнители не назначены */}
          {!isPerformersLoading &&
            (performersError || !performers || performers.length === 0) && (
              <EmployeeSelector
                requestID={request.id}
                employees={employees}
                onSelect={onSelect}
                selectorText="Выберите исполнителя..."
                requestStatus={request.status}
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
                requestStatus={request.status}
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
        {request.status !== "CLOSED" && request.status !== "CANCELLED" && (
          <span className="xl:hidden font-medium">Редактировать: </span>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <RequestEdit request={request} requestStatus={request.status} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Редактировать</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
};
