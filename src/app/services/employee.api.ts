import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./_basequery";
import {
  EmployeeSummaryDto,
  EmployeeFilterParams,
} from "./types/employee.types";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery,
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeSummaryDto[], EmployeeFilterParams>({
      query: ({ roles, isActive }) => {
        const params = new URLSearchParams();

        if (roles) {
          roles.forEach((role) => {
            params.append("roles", role);
          });
        }

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
