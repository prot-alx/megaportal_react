import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./_basequery";

export interface Requests {
  id: number;
  hr_id: number;
  ep_id?: string;
  client_id: string;
  client_contacts?: string;
  description: string;
  address: string;
  request_date: string;
  type: RequestType;
  comment?: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export enum RequestType {
  Default = "Default",
  VIP = "VIP",
  Video = "Video",
  Optical = "Optical",
  Other = "Other",
}

export enum RequestStatus {
  New = "NEW",
  InProgress = "IN_PROGRESS",
  Success = "SUCCESS",
  Closed = "CLOSED",
  Cancelled = "CANCELLED",
  Monitoring = "MONITORING",
  Postponed = "POSTPONED",
}

interface FilterParams {
  status?: RequestStatus;
  type?: RequestType[];
}

// Функция для преобразования формата даты из гг-мм-дд в дд-мм-гг
const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

export const requestsApi = createApi({
  reducerPath: "requestsApi",
  baseQuery,
  endpoints: (builder) => ({
    getRequests: builder.query<Requests[], FilterParams>({
      query: ({ status }) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);

        let queryString = "requests/filtered";
        if (params.toString()) {
          queryString += `?${params.toString()}`;
        }

        return queryString;
      },
      // Преобразование даты после получения данных
      transformResponse: (response: Requests[]) => {
        return response.map((request) => ({
          ...request,
          request_date: formatDate(request.request_date),
        }));
      },
    }),
  }),
});

export const { useGetRequestsQuery } = requestsApi;
