import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./_basequery";

export enum EmployeeRole {
  Admin = "Admin",
  Storekeeper = "Storekeeper",
  Dispatcher = "Dispatcher",
  Performer = "Performer",
}

interface FilterParams {
  roles?: EmployeeRole[];
  isActive?: boolean;
}

export class EmployeeSummaryDto {
  id!: number;
  name?: string;
  role?: EmployeeRole;
}

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery,
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeSummaryDto[], FilterParams>({
      query: ({ roles, isActive }) => {
        const params = new URLSearchParams();

        // Добавляем фильтр по ролям
        if (roles) {
          roles.forEach((role) => {
            params.append("roles", role);
          });
        }

        // Добавляем фильтр по активности
        if (isActive !== undefined) {
          params.append("is_active", String(isActive));
        }

        let queryString = "employee/filtered";
        if (params.toString()) {
          queryString += `?${params.toString()}`;
        }

        return queryString;
      },
    }),
  }),
});

export const { useGetEmployeesQuery } = employeeApi;
