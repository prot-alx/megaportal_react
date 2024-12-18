import { useEffect, useState } from "react";
import { EmployeeSummaryDto } from "@/app/services/employeeApi";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  LoadingSpinner,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared";
import { cn } from "@/shared/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { RiCloseCircleLine } from "@remixicon/react";
import {
  useAssignRequestMutation,
  useUnassignRequestMutation,
} from "@/app/services/requestApi";

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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(
    initialSelectedEmployee?.name ?? "Исполнитель не выбран"
  );
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeSummaryDto | null>(initialSelectedEmployee);

  const [isLoading, setIsLoading] = useState(false);
  const [isUnassignLoading] = useState(false);

  const buttonTextColor = value ? "text-gray-900" : "text-gray-400 font-normal";

  const [assignRequest] = useAssignRequestMutation();
  const [unassignRequest] = useUnassignRequestMutation();

  useEffect(() => {
    if (initialSelectedEmployee) {
      setSelectedEmployee(initialSelectedEmployee);
      setValue(initialSelectedEmployee.name ?? "");
    }
  }, [initialSelectedEmployee]);

  // Если заявка закрыта или отменена, отображаем имя сотрудника текстом
  if (requestStatus === "CLOSED" || requestStatus === "CANCELLED") {
    return (
      <div className="whitespace-nowrap">
        {selectedEmployee ? selectedEmployee.name : "-"}
      </div>
    );
  }

  // Логика для назначения исполнителя
  const assignEmployee = async (selected: EmployeeSummaryDto | null) => {
    if (selected) {
      setIsLoading(true);
      try {
        await assignRequest({
          request_id: requestID,
          performer_id: selected.id,
        }).unwrap();
        console.log("Employee assigned:", selected.id);
      } catch (error) {
        console.error("Failed to assign employee:", error);
      } finally {
        setIsLoading(false); // Заканчиваем загрузку
      }
    }
  };

  const handleUnassign = async () => {
    if (selectedEmployee) {
      setIsLoading(true);
      try {
        await unassignRequest({
          request_id: requestID,
          performer_id: selectedEmployee.id,
        }).unwrap();
        console.log("Employee unassigned:", selectedEmployee.id);
        setSelectedEmployee(null); // Сбрасываем выбранного сотрудника
        setValue(""); // Очищаем отображаемое значение
        onSelect(null); // Передаем null, чтобы обновить родительский компонент
      } catch (error) {
        console.error("Failed to unassign employee:", error);
      } finally {
        setIsLoading(false); // Заканчиваем загрузку
      }
    } else {
      console.error("No employee selected to unassign");
    }
  };

  // Вынесенная логика для отображаемого текста внутри кнопки
  let displayText: React.ReactNode = selectorText;

  if (isLoading) {
    displayText = <LoadingSpinner />;
  } else if (value) {
    const foundEmployee = employees.find((emp) => emp.name === value);
    displayText = foundEmployee?.name ?? (
      <span className="text-gray-400 opacity-70 font-normal">
        Выберите исполнителя
      </span>
    );
  }

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
          <Command>
            <CommandInput placeholder="Поиск исполнителя..." className="h-9" />
            <CommandList>
              <CommandEmpty>Сотрудник не найден</CommandEmpty>
              <CommandGroup>
                {employees.map((emp) => (
                  <CommandItem
                    key={emp.id}
                    value={emp.name ?? ""}
                    onSelect={async (currentValue) => {
                      const selected =
                        employees.find((e) => e.name === currentValue) || null;
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      setSelectedEmployee(selected);
                      onSelect(selected);
                      // Если выбран сотрудник, выполняем назначение
                      await assignEmployee(selected);
                    }}
                  >
                    {emp.name ?? "No name"}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === emp.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
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
            {isUnassignLoading ? (
              <LoadingSpinner />
            ) : (
              <RiCloseCircleLine className="ml-auto min-h-6 min-w-6" />
            )}
          </Button>
        )}
    </div>
  );
};
