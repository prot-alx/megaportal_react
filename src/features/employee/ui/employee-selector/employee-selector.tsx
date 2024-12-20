import {
  Button,
  LoadingSpinner,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { RiCloseCircleLine } from "@remixicon/react";
import { EmployeeSummaryDto } from "@/app/services/types/employee.types";
import { useEmployeeAssignment } from "../../lib/hooks/useEmployeeAssignment";
import { EmployeeSelectList } from "../employee-select-list/employee-select-list";

interface EmployeeSelectorProps {
  employees: EmployeeSummaryDto[];
  onSelect: (employee: EmployeeSummaryDto | null) => void;
  selectorText: string;
  requestID: number;
  initialSelectedEmployee?: EmployeeSummaryDto | null;
  requestStatus: string;
}

export const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  employees,
  onSelect,
  selectorText,
  requestID,
  initialSelectedEmployee = null,
  requestStatus,
}) => {
  const {
    open,
    setOpen,
    value,
    setValue,
    selectedEmployee,
    isLoading,
    assignEmployee,
    handleUnassign,
  } = useEmployeeAssignment(requestID, onSelect, initialSelectedEmployee);

  if (requestStatus === "CLOSED" || requestStatus === "CANCELLED") {
    return (
      <div className="whitespace-nowrap">
        {selectedEmployee ? selectedEmployee.name : "-"}
      </div>
    );
  }

  const buttonTextColor = value ? "text-gray-900" : "text-gray-400 font-normal";
  const displayText = isLoading ? <LoadingSpinner /> : value || selectorText;

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-[200px] justify-between ${buttonTextColor}`}
          >
            {displayText}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <EmployeeSelectList
            employees={employees}
            value={value}
            onSelect={async (currentValue) => {
              const selected =
                employees.find((e) => e.name === currentValue) || null;
              setValue(currentValue === value ? "" : currentValue);
              setOpen(false);
              onSelect(selected);
              await assignEmployee(selected);
            }}
          />
        </PopoverContent>
      </Popover>

      {requestStatus !== "NEW" &&
        requestStatus !== "CLOSED" &&
        requestStatus !== "CANCELLED" &&
        selectedEmployee && (
          <Button
            variant="outline"
            className="w-10 hover:bg-destructive opacity-20 hover:opacity-100"
            onClick={handleUnassign}
          >
            <RiCloseCircleLine className="ml-auto min-h-6 min-w-6" />
          </Button>
        )}
    </div>
  );
};
