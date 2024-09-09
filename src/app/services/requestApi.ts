import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./_basequery";

export interface Requests {
  id: number;
  hr_name?: string;
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

export interface RequestCreate {
  client_id: string;
  ep_id?: string;
  description: string;
  address: string;
  client_contacts: string;
  request_date: string;
  type: RequestType;
}

export interface RequestUpdate {
  client_id?: string;
  ep_id?: string;
  description?: string;
  address?: string;
  client_contacts?: string;
}

export enum RequestType {
  Default = "Default",
  VIP = "VIP",
  Video = "Video",
  Optical = "Optical",
  Other = "Other",
}

export enum RequestStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
  MONITORING = "MONITORING",
  POSTPONED = "POSTPONED",
}

interface FilterParams {
  status?: RequestStatus;
  type?: RequestType[];
}

interface UpdateRequestTypeParams {
  id: number;
  new_type: RequestType;
}

interface UpdateRequestDateParams {
  id: number;
  new_request_date: string;
}

interface AssignRequestParams {
  request_id: number;
  performer_id: number;
}

// Добавляем интерфейс исполнителя
export interface Performer {
  id: number;
  name: string;
}

// Функция для преобразования формата даты из гг-мм-дд в дд-мм-гг
const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

export const requestsApi = createApi({
  reducerPath: "requestsApi",
  baseQuery,
  tagTypes: ["Requests", "Request", "Performers"],
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
      transformResponse: (response: Requests[]) => {
        return response.map((request) => ({
          ...request,
          request_date: formatDate(request.request_date),
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Requests", id } as const)),
              { type: "Requests", id: "LIST" },
            ]
          : [{ type: "Requests", id: "LIST" }],
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
        // Если операция завершилась с ошибкой, можно записать ошибку в логи или выполнить другие действия
        if (error) {
          console.error(
            "Ошибка при обновлении запроса:",
            error instanceof Error ? error : new Error(String(error))
          );
          return []; // В случае ошибки можно не аннулировать теги
        }

        // Если операция прошла успешно, возвращаем стандартный набор тегов для инвалидации кэша
        if (result) {
          return [
            { type: "Requests", id: "LIST" },
            { type: "Request", id },
          ];
        }

        // Базовая логика аннулирования
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
        // Если операция завершилась с ошибкой, можно записать ошибку в логи или выполнить другие действия
        if (error) {
          console.error(
            "Ошибка при обновлении запроса:",
            error instanceof Error ? error : new Error(String(error))
          );
          return []; // В случае ошибки можно не аннулировать теги
        }

        // Если операция прошла успешно, возвращаем стандартный набор тегов для инвалидации кэша
        if (result) {
          return [
            { type: "Requests", id: "LIST" },
            { type: "Request", id },
          ];
        }

        // Базовая логика аннулирования
        return [{ type: "Requests", id: "LIST" }];
      },
    }),
    createRequest: builder.mutation<Requests, RequestCreate>({
      query: (newRequest) => ({
        url: "requests",
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
        // Если операция завершилась с ошибкой, можно записать ошибку в логи или выполнить другие действия
        if (error) {
          console.error(
            "Ошибка при обновлении запроса:",
            error instanceof Error ? error : new Error(String(error))
          );
          return []; // В случае ошибки можно не аннулировать теги
        }

        // Если операция прошла успешно, возвращаем стандартный набор тегов для инвалидации кэша
        if (result) {
          return [
            { type: "Requests", id: "LIST" },
            { type: "Request", id },
          ];
        }

        // Базовая логика аннулирования
        return [{ type: "Requests", id: "LIST" }];
      },
    }),
    updateRequest: builder.mutation<void, { id: number; data: RequestUpdate }>({
      query: ({ id, data }) => ({
        url: `requests/${id}/update`, // Эндпоинт для обновления заявки
        method: "PATCH",
        data, // Передаем данные на сервер
      }),
      invalidatesTags: (result, error, { id }) => {
        if (error) {
          console.error(
            "Ошибка при обновлении запроса:",
            error instanceof Error ? error : new Error(String(error))
          );
          return []; // В случае ошибки не аннулируем теги
        }

        if (result) {
          return [
            { type: "Requests", id: "LIST" },
            { type: "Request", id },
          ];
        }

        // Базовая логика аннулирования
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
        // Если произошла ошибка, логируем её
        if (error) {
          console.error(
            "Ошибка при назначении заявки:",
            error instanceof Error ? error : new Error(String(error))
          );
          return []; // В случае ошибки не аннулируем теги
        }

        // Если операция прошла успешно, аннулируем теги для обновления данных
        if (result) {
          return [
            { type: "Requests", id: request_id },
            { type: "Requests", id: "LIST" },
          ];
        }

        // Базовая логика аннулирования
        return [{ type: "Requests", id: "LIST" }];
      },
    }),
    getPerformersByRequestId: builder.query<Performer[], number>({
      query: (requestId) => ({
        url: `request-data/${requestId}/performers`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => {
        if (error) {
          console.error(
            "Ошибка при получении исполнителей по заявке:",
            error instanceof Error ? error : new Error(String(error))
          );
          return []; // Не аннулируем теги в случае ошибки
        }

        // Если запрос успешен, аннулируем кэш для обновления данных исполнителей
        if (result) {
          return [
            { type: "Performers", id: requestId },
            { type: "Requests", id: requestId },
          ];
        }

        return [{ type: "Performers", id: requestId }];
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
  useAssignRequestMutation,
  useGetPerformersByRequestIdQuery,
} = requestsApi;
