import { useState } from "react";
import { EmployeeSummaryDto } from "@/app/services/types/employee.types";
import {
  useAssignRequestMutation,
  useUnassignRequestMutation,
} from "@/app/services/request.api";

export const useEmployeeAssignment = (
  requestID: number,
  onSelect: (employee: EmployeeSummaryDto | null) => void,
  initialEmployee: EmployeeSummaryDto | null = null
) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(
    initialEmployee?.name ?? "Исполнитель не выбран"
  );
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeSummaryDto | null>(initialEmployee);
  const [isLoading, setIsLoading] = useState(false);

  const [assignRequest] = useAssignRequestMutation();
  const [unassignRequest] = useUnassignRequestMutation();

  const assignEmployee = async (selected: EmployeeSummaryDto | null) => {
    if (selected) {
      setIsLoading(true);
      try {
        await assignRequest({
          request_id: requestID,
          performer_id: selected.id,
        }).unwrap();
      } catch (error) {
        console.error("Failed to assign employee:", error);
      } finally {
        setIsLoading(false);
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
        setSelectedEmployee(null);
        setValue("");
        onSelect(null);
      } catch (error) {
        console.error("Failed to unassign employee:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    open,
    setOpen,
    value,
    setValue,
    selectedEmployee,
    setSelectedEmployee,
    isLoading,
    assignEmployee,
    handleUnassign,
  };
};
