import { EmployeeSummaryDto } from "@/app/services/types/employee.types";
import { ToggleGroup, ToggleGroupItem } from "@/shared";

interface StatusToggleGroupProps {
  performer: EmployeeSummaryDto | null;
  requestStatus: string;
}

export const StatusToggleGroup: React.FC<StatusToggleGroupProps> = ({
  performer,
  requestStatus,
}) => (
  <ToggleGroup type="single">
    <ToggleGroupItem className="w-[115px]" value="a">
      Закрыть
    </ToggleGroupItem>
    {performer !== null &&
      requestStatus !== "NEW" &&
      requestStatus !== "IN_PROGRESS" && (
        <ToggleGroupItem className="w-[115px]" value="d">
          В работу
        </ToggleGroupItem>
      )}
    {performer !== null && requestStatus !== "MONITORING" && (
      <ToggleGroupItem className="w-[115px]" value="b">
        Мониторинг
      </ToggleGroupItem>
    )}
    {requestStatus !== "POSTPONED" && (
      <ToggleGroupItem className="w-[120px]" value="c">
        В отложенные
      </ToggleGroupItem>
    )}
  </ToggleGroup>
);
