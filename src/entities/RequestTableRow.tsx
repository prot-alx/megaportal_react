import {
  Requests,
  RequestType,
  useUpdateRequestDateMutation,
  useUpdateRequestTypeMutation,
} from "@/app/services/requestApi";
import { RequestDatePicker } from "@/shared/components/datepickers/requestDatePicker";
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
}

export const RequestTableRow: React.FC<RequestTableRowProps> = ({
  request,
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
      className="block xl:table-row border-y-2 border-gray-300 group"
    >
      <TableCell className="block xl:table-cell py-2">
        <span className="xl:hidden font-medium">Абонент: </span>
        {request.client}
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
        <a className="xl:hidden" href={`tel:${request.contacts}`}>
          {request.contacts}
        </a>
        <span className="hidden xl:inline">{request.contacts}</span>
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
          123
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
