import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetRequestsQuery, RequestStatus } from "@/app/services/requestApi";
import { useGetEmployeesQuery, EmployeeRole } from "@/app/services/employeeApi";
import { LoadingSpinner } from "@/shared/components/ui/preloader";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
} from "@/shared/components/ui/table";
import { DateFilter } from "@/features/DateFilter";
import { TypeFilter } from "@/features/TypeFilter";
import { setRequests } from "@/entities/slices/requestSlice";
import { RootState, useAppSelector } from "@/app/store/store";
import {
  endOfDay,
  isAfter,
  isBefore,
  isToday,
  parse,
  startOfDay,
} from "date-fns";
import { RiEditLine } from "@remixicon/react";
import { RequestPagination } from "@/features/RequestPagination";
import { RequestTableRow } from "@/entities/RequestTableRow";

interface UnassignedRequestsProps {
  status: RequestStatus;
}

export const AllRequests: React.FC<UnassignedRequestsProps> = ({ status }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: employees,
    isLoading: empIsLoading,
    error: empError,
  } = useGetEmployeesQuery({
    roles: [EmployeeRole.Dispatcher, EmployeeRole.Performer],
  });

  const {
    data: fetchedRequests,
    isLoading: reqIsLoading,
    error: reqError,
  } = useGetRequestsQuery({
    status,
    type: useAppSelector((state: RootState) => state.filters.selectedTypes),
    page: currentPage,
    limit: itemsPerPage,
  });

  const totalPages = fetchedRequests?.totalPages ?? 0;

  const requests = useAppSelector(
    (state: RootState) => state.requests.requests
  );
  const selectedTypes = useAppSelector(
    (state: RootState) => state.filters.selectedTypes
  );
  const selectedDateFilters = useAppSelector(
    (state: RootState) => state.filters.selectedDateFilters
  );
  const dateFilterCounts = useAppSelector(
    (state: RootState) => state.requests.dateFilterCounts
  );

  useEffect(() => {
    if (fetchedRequests) {
      dispatch(setRequests(fetchedRequests));
    }
  }, [fetchedRequests, dispatch]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const typeMatch =
        selectedTypes.length === 0 || selectedTypes.includes(request.type);

      const requestDate = parse(request.request_date, "dd-MM-yyyy", new Date());
      const dateMatch =
        selectedDateFilters.includes("all") ||
        (selectedDateFilters.includes("today") && isToday(requestDate)) ||
        (selectedDateFilters.includes("past") &&
          isBefore(requestDate, startOfDay(new Date()))) ||
        (selectedDateFilters.includes("future") &&
          isAfter(requestDate, endOfDay(new Date())));

      return typeMatch && dateMatch;
    });
  }, [requests, selectedTypes, selectedDateFilters]);

  if (reqIsLoading || empIsLoading) return <LoadingSpinner />;
  if (reqError || empError) return <p>Error loading requests or employees.</p>;

  return (
    <div>
      {totalPages > 1 && (
        <RequestPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
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
            <TableHead>
              <DateFilter dateFilterCounts={dateFilterCounts} />
            </TableHead>
            <TableHead>
              <TypeFilter fetchedRequests={fetchedRequests?.data || []} />
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
          {filteredRequests.map((request) => (
            <RequestTableRow
              key={request.id}
              request={request}
              employees={employees || []}
              isChecked={false}
              onSelect={() => {}}
              onCheckboxChange={() => {}}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
