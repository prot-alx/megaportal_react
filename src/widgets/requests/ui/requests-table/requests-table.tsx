import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  LoadingSpinner,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  baseURL,
} from "@/shared";
import { RequestTableRow } from "@/entities";
import { RequestTypeFilter, RequestPagination } from "@/features";
import { RiEditLine } from "@remixicon/react";
import { useGetRequestsQuery } from "@/app/services/request.api";
import { useGetEmployeesQuery } from "@/app/services/employee.api";
import { EmployeeRole } from "@/app/services/types/employee.types";
import { RequestStatus, RequestType } from "@/app/services/types/request.types";

interface RequestsProps {
  status: RequestStatus[];
}

export const AllRequests: React.FC<RequestsProps> = ({
  status,
}: {
  status: RequestStatus[];
}) => {
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

  const { data, isError, isLoading, refetch } = useGetRequestsQuery(
    {
      page: currentPage,
      status,
      type: selectedTypes.length > 0 ? selectedTypes : undefined,
    },
    {
      pollingInterval: 0,
      refetchOnMountOrArgChange: false,
    }
  );

  useEffect(() => {
    const socket = io(baseURL, {
      withCredentials: true,
    });

    socket.on("requestUpdate", (update) => {
      console.log("Received update:", update);
      refetch();
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    return () => {
      socket.off("requestUpdate");
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [refetch]);

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
