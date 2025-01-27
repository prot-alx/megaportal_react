import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./_basequery";
import {
  AssignRequestParams,
  RequestCreate,
  RequestFilterParams,
  RequestResponse,
  Requests,
  RequestUpdate,
  UpdateRequestComment,
  UpdateRequestDateParams,
  UpdateRequestTypeParams,
} from "./types/request.types";
import { buildQueryString, formatDate } from "./utils/utils";

export const requestsApi = createApi({
  reducerPath: "requestsApi",
  baseQuery,
  tagTypes: ["Requests", "Request", "Performers"],
  endpoints: (builder) => ({
    getRequests: builder.query<RequestResponse, RequestFilterParams>({
      query: (params) => {
        const queryString = buildQueryString(params);
        return `request-data/filtered?${queryString}`;
      },
      transformResponse: (response: RequestResponse) => {
        return {
          ...response,
          requests: response.requests.map((requestData) => ({
            ...requestData,
            request: {
              ...requestData.request,
              request_date: formatDate(requestData.request.request_date),
              request_updated_at: formatDate(
                new Date(requestData.request.request_updated_at)
                  .toISOString()
                  .split("T")[0]
              ),
              request_created_at: formatDate(
                new Date(requestData.request.request_created_at)
                  .toISOString()
                  .split("T")[0]
              ),
            },
          })),
        };
      },
      providesTags: (result, error) => {
        if (error) {
          console.error(
            "Ошибка при получении заявок:",
            error instanceof Error ? error : new Error(String(error))
          );
          return [];
        }

        if (result) {
          return [{ type: "Requests", id: "LIST" }];
        }

        return [];
      },
    }),
    getRequestById: builder.query<Requests, number>({
      query: (id) => `requests/${id}`,
      providesTags: (result, error, id) => {
        // Если произошла ошибка, логируем её
        if (error) {
          console.error(
            "Ошибка при получении запроса по ID:",
            error instanceof Error ? error : new Error(String(error))
          );
          return []; // В случае ошибки не аннулируем теги
        }

        // Если запрос прошел успешно и результат существует
        if (result) {
          return [{ type: "Request", id }];
        }

        // В случае, если результат не пришел, можно аннулировать кэш для данного id
        return [{ type: "Request", id }];
      },
    }),
    updateRequestType: builder.mutation<void, UpdateRequestTypeParams>({
      query: ({ id, new_type }) => ({
        url: `requests/${id}/type`,
        method: "PATCH",
        data: { new_type },
      }),
      invalidatesTags: (result, error, { id }) => {
        if (error) {
          console.error(
            "Ошибка при обновлении запроса:",
            error instanceof Error ? error : new Error(String(error))
          );
          return [];
        }

        if (result) {
          return [
            { type: "Requests", id: "LIST" },
            { type: "Request", id },
          ];
        }

        return [{ type: "Requests", id: "LIST" }];
      },
    }),
    updateRequestDate: builder.mutation<void, UpdateRequestDateParams>({
      query: ({ id, new_request_date }) => ({
        url: `requests/${id}/date`,
        method: "PATCH",
        data: { new_request_date },
      }),
      invalidatesTags: (result, error, { id }) => {
        if (error) {
          console.error(
            "Ошибка при обновлении запроса:",
            error instanceof Error ? error : new Error(String(error))
          );
          return [];
        }

        if (result) {
          return [
            { type: "Requests", id: "LIST" },
            { type: "Request", id },
          ];
        }

        return [{ type: "Requests", id: "LIST" }];
      },
    }),
    createRequest: builder.mutation<Requests, RequestCreate>({
      query: (newRequest) => ({
        url: "request-data",
        method: "POST",
        data: newRequest,
      }),
      invalidatesTags: [{ type: "Requests", id: "LIST" }],
    }),
    cancelRequest: builder.mutation<void, number>({
      query: (id) => ({
        url: `requests/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => {
        if (error) {
          console.error(
            "Ошибка при обновлении запроса:",
            error instanceof Error ? error : new Error(String(error))
          );
          return [];
        }

        if (result) {
          return [
            { type: "Requests", id: "LIST" },
            { type: "Request", id },
          ];
        }

        return [{ type: "Requests", id: "LIST" }];
      },
    }),
    updateRequest: builder.mutation<void, { id: number; data: RequestUpdate }>({
      query: ({ id, data }) => ({
        url: `requests/${id}/update`,
        method: "PATCH",
        data,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { id }) => {
        if (error) {
          console.error(
            "Ошибка при обновлении запроса:",
            error instanceof Error ? error : new Error(String(error))
          );
          return [];
        }

        if (result) {
          return [
            { type: "Requests", id: "LIST" },
            { type: "Request", id },
          ];
        }

        return [{ type: "Requests", id: "LIST" }];
      },
    }),
    updateRequestComment: builder.mutation<
      void,
      { id: number; data: UpdateRequestComment }
    >({
      query: ({ id, data }) => ({
        url: `request-data/${id}/comment`,
        method: "PATCH",
        data,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { id }) => {
        if (error) {
          console.error(
            "Ошибка при обновлении запроса:",
            error instanceof Error ? error : new Error(String(error))
          );
          return [];
        }

        if (result) {
          return [
            { type: "Requests", id: "LIST" },
            { type: "Request", id },
          ];
        }

        return [{ type: "Requests", id: "LIST" }];
      },
    }),
    assignRequest: builder.mutation<void, AssignRequestParams>({
      query: ({ request_id, performer_id }) => ({
        url: "/request-data/assign",
        method: "POST",
        data: { request_id, performer_id },
      }),
      invalidatesTags: (result, error, { request_id }) => {
        if (error) {
          console.error(
            "Ошибка при назначении заявки:",
            error instanceof Error ? error : new Error(String(error))
          );
          return [];
        }

        if (result) {
          return [
            { type: "Requests", id: request_id },
            { type: "Requests", id: "LIST" },
          ];
        }

        return [{ type: "Requests", id: "LIST" }];
      },
    }),
    unassignRequest: builder.mutation<
      void,
      { request_id: number; performer_id: number }
    >({
      query: ({ request_id, performer_id }) => ({
        url: `/request-data/${request_id}/performer/${performer_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { request_id }) => {
        if (error) {
          console.error(
            "Ошибка при отмене назначения заявки:",
            error instanceof Error ? error : new Error(String(error))
          );
          return [];
        }

        if (result) {
          return [
            { type: "Requests", id: request_id },
            { type: "Requests", id: "LIST" },
          ];
        }

        return [{ type: "Requests", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useGetRequestByIdQuery,
  useUpdateRequestTypeMutation,
  useUpdateRequestDateMutation,
  useCreateRequestMutation,
  useCancelRequestMutation,
  useUpdateRequestMutation,
  useUpdateRequestCommentMutation,
  useAssignRequestMutation,
  useUnassignRequestMutation,
} = requestsApi;
