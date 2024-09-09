import { EmployeeSummaryDto } from "@/app/services/employeeApi";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { RiCheckLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useAssignRequestMutation } from "@/app/services/requestApi";

interface EmployeeSelectorProps {
  employees: EmployeeSummaryDto[];
  onSelect: (employee: EmployeeSummaryDto | null) => void;
  selectorText: string;
  requestID: number;
  initialSelectedEmployee?: EmployeeSummaryDto | null;
}

export const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  employees,
  onSelect,
  selectorText,
  requestID,
  initialSelectedEmployee = null, // Установим по умолчанию null
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(
    initialSelectedEmployee?.name ?? ""
  );
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeSummaryDto | null>(initialSelectedEmployee);

  const buttonTextColor = value ? "text-gray-900" : "text-gray-400 font-normal";
  const isEmployeeSelected = !!selectedEmployee;

  const [assignRequest] = useAssignRequestMutation();

  useEffect(() => {
    if (initialSelectedEmployee) {
      setSelectedEmployee(initialSelectedEmployee);
      setValue(initialSelectedEmployee.name ?? "");
    }
  }, [initialSelectedEmployee]);

  const handleAssign = async () => {
    if (selectedEmployee) {
      try {
        await assignRequest({
          request_id: requestID,
          performer_id: selectedEmployee.id,
        }).unwrap();
        console.log("Employee assigned:", selectedEmployee.id);
        onSelect(selectedEmployee); // Передаем выбранного сотрудника
      } catch (error) {
        console.error("Failed to assign employee:", error);
      }
    } else {
      console.error("No employee selected");
    }
  };

  // Если есть начальный выбранный сотрудник, устанавливаем его в состояние
  useEffect(() => {
    if (initialSelectedEmployee) {
      setSelectedEmployee(initialSelectedEmployee);
      setValue(initialSelectedEmployee.name ?? "");
    }
  }, [initialSelectedEmployee]);

  return (
    <div className="flex justify-center items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-[200px] justify-between ${buttonTextColor}`}
          >
            {value
              ? employees.find((emp) => emp.name === value)?.name ??
                "Выберите сотрудника..."
              : selectorText}
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
                    onSelect={(currentValue) => {
                      const selected =
                        employees.find((e) => e.name === currentValue) || null;
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      setSelectedEmployee(selected); // Устанавливаем выбранного сотрудника
                      onSelect(selected); // Передаем выбранного сотрудника
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              role="button"
              tabIndex={0}
              onClick={handleAssign}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-2 hover:bg-green-400 opacity-10 hover:opacity-90",
                isEmployeeSelected ? "opacity-95" : "hover:bg-red-400"
              )}
            >
              <RiCheckLine className="ml-auto min-h-7 min-w-7" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {isEmployeeSelected ? (
              <p>Назначить</p>
            ) : (
              <p>Необходимо выбрать сотрудника</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
