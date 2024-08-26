import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./_basequery";

export interface Requests {
  id: number;
  hr_id: number;
  ep_id?: string;
  client_id: string;
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

export const requestsApi = createApi({
  reducerPath: "requestsApi",
  baseQuery,
  endpoints: (builder) => ({
    getRequests: builder.query<Requests[], FilterParams>({
      query: ({ status, type }) => {
        let queryString = "requests/filtered";

        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (type && type.length > 0) {
          type.forEach((t) => params.append("type", t));
        }

        if (params.toString()) {
          queryString += `?${params.toString()}`;
        }

        return queryString;
      },
    }),
  }),
});

export const { useGetRequestsQuery } = requestsApi;
