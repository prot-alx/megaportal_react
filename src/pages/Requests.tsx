import React, { useState } from 'react';
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
import { RequestStatus, useGetRequestsQuery } from "@/app/services/requestApi";

interface RequestsProps {
  status: RequestStatus;
}

export const AllRequests: React.FC<RequestsProps> = ({ status }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isError, isLoading } = useGetRequestsQuery({ page: currentPage, status });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return <div>Ошибка</div>;
  }

  if (!data) {
    return <div>Нет данных</div>;
  }

  const { requests, totalPages } = data;

  console.log(requests)

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
            <TableHead>Дата</TableHead>
            <TableHead>Тип</TableHead>
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
