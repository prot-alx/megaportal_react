export enum EmployeeRole {
  Admin = "Admin",
  Storekeeper = "Storekeeper",
  Dispatcher = "Dispatcher",
  Performer = "Performer",
}

export interface EmployeeFilterParams {
  roles?: EmployeeRole[];
  isActive?: boolean;
}

export class EmployeeSummaryDto {
  id!: number;
  name?: string;
  role?: EmployeeRole;
}