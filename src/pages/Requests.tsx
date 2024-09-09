import { useEffect, useMemo } from "react";
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
import { RequestTableRow } from "@/features/RequestTableRow";
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
import { RiCloseLargeFill, RiEditLine } from "@remixicon/react";

interface UnassignedRequestsProps {
  status: RequestStatus;
}

export const AllRequests: React.FC<UnassignedRequestsProps> = ({ status }) => {
  const dispatch = useDispatch();
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
  });

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
              <TypeFilter fetchedRequests={fetchedRequests || []} />
            </TableHead>
            <TableHead>Исполнитель</TableHead>
            <TableHead>Комментарий</TableHead>
            <TableHead>
              <RiEditLine size="25px" color="black" />
            </TableHead>
            <TableHead>
              <RiCloseLargeFill size="25px" color="black" />
            </TableHead>
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
