import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
} from "@/shared/components/ui/table";
import { RiEditLine } from "@remixicon/react";
import { RequestPagination } from "@/features/RequestPagination";
import { RequestTableRow } from "@/entities/RequestTableRow";
import {
  RequestStatus,
  RequestType,
  useGetRequestsQuery,
} from "@/app/services/requestApi";
import { EmployeeRole, useGetEmployeesQuery } from "@/app/services/employeeApi";
import { LoadingSpinner } from "@/shared/components/ui/preloader";
import RequestTypeFilter from "@/features/TypeFilter";

interface RequestsProps {
  status: RequestStatus;
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

  return (
    <div>
      {totalPages > 1 && (
        <RequestPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      )}
      <div className="flex justify-between mb-4"></div>
      <Table className="min-w-full bg-white">
        <TableHeader className="hidden xl:table-header-group">
          <TableRow>
            <TableHead>Абонент</TableHead>
            <TableHead>Номер ЕП</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Адрес</TableHead>
            <TableHead>Контакт</TableHead>
            {status !== "CLOSED" && status !== "CANCELLED" && (
              <TableHead>Дата выезда</TableHead>
            )}
            {status === "CLOSED" ||
              (status === "CANCELLED" && (
                <TableHead className="flex items-center justify-center">
                  Дата закрытия
                </TableHead>
              ))}
            <TableHead>
              <RequestTypeFilter
                selectedTypes={selectedTypes}
                onTypeChange={handleTypeChange}
              />
            </TableHead>
            <TableHead>Исполнитель</TableHead>
            <TableHead>Комментарий</TableHead>
            {status !== "CLOSED" && status !== "CANCELLED" && (
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
