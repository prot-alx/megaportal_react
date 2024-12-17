import React, { useState } from "react";
import {
  RequestStatus,
  RequestType,
  useGetRequestsQuery,
} from "@/app/services/requestApi";
import { RiEditLine } from "@remixicon/react";
import { EmployeeRole, useGetEmployeesQuery } from "@/app/services/employeeApi";
import { RequestTableRow } from "@/entities/RequestTableRow";
import { RequestPagination } from "@/features";
import RequestTypeFilter from "@/features/TypeFilter";
import {
  LoadingSpinner,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@/shared/components";

interface RequestsProps {
  status: RequestStatus[];
}

export const AllRequests: React.FC<RequestsProps> = ({ status }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<RequestType[]>([]);

  const handleTypeChange = (type: RequestType) => {
    setSelectedTypes((prevSelectedTypes) => {
      // Если тип уже выбран, убираем его из массива
      if (prevSelectedTypes.includes(type)) {
        return prevSelectedTypes.filter((t) => t !== type);
      }
      // Если тип не выбран, добавляем его в массив
      return [...prevSelectedTypes, type];
    });
  };

  const { data, isError, isLoading } = useGetRequestsQuery({
    page: currentPage,
    status,
    type: selectedTypes.length > 0 ? selectedTypes : undefined,
  });
  const {
    data: employeesForSelector,
    error: isEmployeeError,
    isLoading: isEmployeeLoading,
  } = useGetEmployeesQuery({
    roles: [EmployeeRole.Dispatcher, EmployeeRole.Performer],
    isActive: true,
  });

  if (isEmployeeLoading || isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (isEmployeeError) {
    return <div>Ошибка загрузки сотрудников</div>;
  }

  if (isError) {
    return <div>Ошибка: {isError}</div>;
  }

  if (!data) {
    return <div>Нет данных</div>;
  }

  const { requests, totalPages } = data;

  // Проверяем, содержатся ли "CLOSED" или "CANCELLED" в массиве статусов
  const isClosedOrCancelled =
    status.includes(RequestStatus.CLOSED) ||
    status.includes(RequestStatus.CANCELLED);

  return (
    <div>
      <RequestPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
      />

      <div className="flex justify-between mb-4"></div>
      <Table className="min-w-full bg-white">
        <TableHeader className="hidden xl:table-header-group">
          <TableRow>
            <TableHead>Абонент</TableHead>
            <TableHead>Номер ЕП</TableHead>
            <TableHead className="min-w-[250px]">Описание</TableHead>
            <TableHead>Адрес</TableHead>
            <TableHead>Контакт</TableHead>
            {!isClosedOrCancelled && <TableHead>Дата выезда</TableHead>}
            {isClosedOrCancelled && (
              <TableHead className="flex items-center justify-center">
                Дата закрытия
              </TableHead>
            )}
            <TableHead>
              <RequestTypeFilter
                selectedTypes={selectedTypes}
                onTypeChange={handleTypeChange}
              />
            </TableHead>
            <TableHead>Исполнитель</TableHead>
            <TableHead className="min-w-[250px]">Комментарий</TableHead>
            {!isClosedOrCancelled && (
              <TableHead className="flex items-center justify-center opacity-60">
                <RiEditLine size="25px" color="black" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <RequestTableRow
              key={request.request.id}
              request={request.request}
              performer={request.performer || null}
              employeesList={employeesForSelector || []}
              onSelect={() => {}}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
