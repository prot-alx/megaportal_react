import {
  Requests,
  RequestType,
  useUpdateRequestDateMutation,
  useUpdateRequestTypeMutation,
} from "@/app/services/requestApi";
import { format } from "date-fns";
import { useCallback } from "react";
import { EmployeeSummaryDto } from "@/app/services/employeeApi";
import {
  LoadingSpinner,
  TableCell,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TableCellCutted,
} from "@/shared";
import {
  RequestDatePicker,
  RequestTypeSelector,
  EmployeeSelector,
  RequestEdit,
  RequestCommentEdit,
} from "@/features";

interface RequestTableRowProps {
  request: Requests;
  performer: EmployeeSummaryDto | null;
  employeesList: EmployeeSummaryDto[];
  onSelect: (employee: EmployeeSummaryDto | null) => void;
}

export const RequestTableRow: React.FC<RequestTableRowProps> = ({
  request,
  performer,
  employeesList,
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

  const handleUpdateRequestDate = useCallback(
    async (id: number, newDate: string) => {
      try {
        await updateRequestDate({
          id,
          new_request_date: newDate,
        }).unwrap();
      } catch (error) {
        console.error("Failed to update request date:", error);
      }
    },
    [updateRequestDate]
  );

  const handleUpdateRequestType = useCallback(
    async (id: number, newType: RequestType) => {
      try {
        await updateRequestType({
          id,
          new_type: newType,
        }).unwrap();
      } catch (error) {
        console.error("Failed to update request type:", error);
      }
    },
    [updateRequestType]
  );

  return (
    <TableRow
      key={request.id}
      className="block xl:table-row border-y-2 border-gray-300 group w-full"
    >
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Абонент: </span>
        {request.client} - {request.id}
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">ЕП: </span>
        {request.ep_id}
      </TableCell>
      <TableCell className="block xl:table-cell py-2 max-w-[500px]">
        <span className="xl:hidden font-medium">Описание: </span>
        <TableCellCutted text={request.description} />
      </TableCell>
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Адрес: </span>
        {request.address}
      </TableCell>
      <TableCell className="block xl:table-cell py-2 min-w-[145px]">
        <span className="xl:hidden font-medium">Контакты: </span>
        <a className="xl:hidden" href={`tel:${request.contacts}`}>
          {request.contacts}
        </a>
        <span className="hidden xl:inline">{request.contacts}</span>
      </TableCell>
      {request.status === "CLOSED" || request.status === "CANCELLED" ? (
        <TableCell className="block xl:table-cell py-2">
          <span className="xl:hidden font-medium">Дата обновления: </span>
          {isDateLoading && <LoadingSpinner />}
          {!isDateLoading && isDateError && (
            <div className="text-red-500">Ошибка при обновлении даты</div>
          )}
          {!isDateLoading && !isDateError && (
            <RequestDatePicker
              id={request.id}
              initialDate={request.request_updated_at} // Используем updated_at
              onDateChange={() => {}}
              requestStatus={request.status}
            />
          )}
        </TableCell>
      ) : (
        <TableCell className="block xl:table-cell py-2">
          <span className="xl:hidden font-medium">Дата выезда: </span>
          {isDateLoading && <LoadingSpinner />}
          {!isDateLoading && isDateError && (
            <div className="text-red-500">Ошибка при обновлении даты</div>
          )}
          {!isDateLoading && !isDateError && (
            <RequestDatePicker
              id={request.id}
              initialDate={request.request_date} // Используем request_date
              onDateChange={(id, date) =>
                handleUpdateRequestDate(id, format(date, "yyyy-MM-dd"))
              }
              requestStatus={request.status}
            />
          )}
        </TableCell>
      )}
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
          <EmployeeSelector
            employees={employeesList}
            onSelect={onSelect}
            selectorText="Выберите исполнителя..."
            initialSelectedEmployee={
              performer ? { name: performer.name, id: performer.id } : null
            }
            requestID={request.id}
            requestStatus={request.status}
          />
        </div>
      </TableCell>
      <TableCell className="block xl:table-cell py-2 max-w-[500px]">
        <span className="xl:hidden font-medium">Комментарий: </span>
        <TableCellCutted text={request.comment} />
      </TableCell>
      {request.status !== "CLOSED" && request.status !== "CANCELLED" && (
        <TableCell className="flex xl:flex xl:flex-col py-2 gap-1">
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
          <RequestCommentEdit
            request={request}
            requestStatus={request.status}
            performer={performer}
          />
        </TableCell>
      )}
    </TableRow>
  );
};
