import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/shared";
import { CheckIcon } from "@radix-ui/react-icons";
import { EmployeeSummaryDto } from "@/app/services/types/employee.types";
import { cn } from "@/shared/utils";

interface EmployeeSelectListProps {
  employees: EmployeeSummaryDto[];
  value: string;
  onSelect: (value: string) => void;
}

export const EmployeeSelectList: React.FC<EmployeeSelectListProps> = ({
  employees,
  value,
  onSelect,
}) => (
  <Command>
    <CommandInput placeholder="Поиск исполнителя..." className="h-9" />
    <CommandList>
      <CommandEmpty>Сотрудник не найден</CommandEmpty>
      <CommandGroup>
        {employees.map((emp) => (
          <CommandItem key={emp.id} value={emp.name ?? ""} onSelect={onSelect}>
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
);
