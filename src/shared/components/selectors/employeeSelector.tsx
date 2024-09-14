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
import { RiAddLine, RiCloseCircleLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import {
  useAssignRequestMutation,
  useUnassignRequestMutation,
} from "@/app/services/requestApi";
import ActionMenu from "@/features/ActionMenu";

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
    initialSelectedEmployee?.name ?? ""
  );
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeSummaryDto | null>(initialSelectedEmployee);

  const buttonTextColor = value ? "text-gray-900" : "text-gray-400 font-normal";
  const isEmployeeSelected = !!selectedEmployee;

  const [assignRequest] = useAssignRequestMutation();
  const [unassignRequest] = useUnassignRequestMutation();

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

  const handleUnassign = async () => {
    if (selectedEmployee) {
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
      }
    } else {
      console.error("No employee selected to unassign");
    }
  };

  // Если есть начальный выбранный сотрудник, устанавливаем его в состояние
  useEffect(() => {
    if (initialSelectedEmployee) {
      setSelectedEmployee(initialSelectedEmployee);
      setValue(initialSelectedEmployee.name ?? "");
    }
  }, [initialSelectedEmployee]);

  const actionButtons = [
    {
      id: "assign",
      action: handleAssign,
      tooltipText: "Добавить сотрудника",
      icon: <RiAddLine className="ml-auto min-h-7 min-w-7" />,
      isEnabled: isEmployeeSelected,
      disabledText: "Необходимо выбрать сотрудника",
    },
    {
      id: "unassign",
      action: handleUnassign,
      tooltipText: "Снять",
      icon: <RiCloseCircleLine className="ml-auto min-h-7 min-w-7" />,
      isEnabled: isEmployeeSelected,
      disabledText: "Необходимо выбрать сотрудника",
    },
  ];

  // Если заявка закрыта или отменена, отображаем имя сотрудника текстом
  if (requestStatus === "CLOSED" || requestStatus === "CANCELLED") {
    return (
      <div className="whitespace-nowrap">
        {selectedEmployee
          ? selectedEmployee.name
          : "-"}
      </div>
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
                      setSelectedEmployee(selected);
                      onSelect(selected);
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
      <ActionMenu actions={actionButtons} />
    </div>
  );
};
