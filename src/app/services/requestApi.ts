import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./_basequery";

export interface Requests {
  id: number;
  type: RequestType;
  ep_id: string;
  client: string;
  contacts: string;
  description: string;
  address: string;
  comment: string | null;
  status: RequestStatus;
  request_date: string;
  request_updated_at: string;
  request_created_at: string;
  hr: {
    id: number;
    name: string;
    role: string;
    is_active: boolean;
  };
}

export interface EditRequest {
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

interface UpdateRequestTypeParams {
  id: number;
  new_type: RequestType;
}

interface UpdateRequestComment {
  comment?: string;
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

export interface FilterParams {
  type?: RequestType[];
  status?: RequestStatus[];
  executor_id?: number;
  performer_id?: number;
  request_date_from?: string;
  request_date_to?: string;
  updated_at_from?: string;
  updated_at_to?: string;
  page?: number;
  limit?: number;
}

export interface RequestResponse {
  totalPages: number;
  currentPage: number;
  limit: number;
  total: number;
  requests: {
    id: number;
    request: Requests;
    executor: Performer | null;
    performer: Performer | null;
  }[];
}

// Функция для преобразования формата даты из гг-мм-дд в дд-мм-гг
const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

const buildQueryString = (params: FilterParams): string => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        // Преобразование массива в отдельные параметры запроса
        value.forEach((item) => {
          query.append(key, String(item)); // Добавляем каждый элемент массива как отдельный параметр
        });
      } else {
        query.append(key, String(value)); // Добавляем одиночное значение
      }
    }
  });

  return query.toString();
};

export const requestsApi = createApi({
  reducerPath: "requestsApi",
  baseQuery,
  tagTypes: ["Requests", "Request", "Performers"],
  endpoints: (builder) => ({
    getRequests: builder.query<RequestResponse, FilterParams>({
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
    updateRequestComment: builder.mutation<
      void,
      { id: number; data: UpdateRequestComment }
    >({
      query: ({ id, data }) => ({
        url: `request-data/${id}/comment`,
        method: "PATCH",
        data,
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
    unassignRequest: builder.mutation<
      void,
      { request_id: number; performer_id: number }
    >({
      query: ({ request_id, performer_id }) => ({
        url: `/request-data/${request_id}/performer/${performer_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { request_id }) => {
        // Если произошла ошибка, логируем её
        if (error) {
          console.error(
            "Ошибка при отмене назначения заявки:",
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
