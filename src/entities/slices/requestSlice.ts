  import {
    FilterParams,
    Performer,
    Requests,
  } from "@/app/services/requestApi";
  import { RootState } from "@/app/store/store";
  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

  interface Pagination {
    totalPages: number;
    currentPage: number;
    limit: number;
    total: number;
  }

  interface RequestsState {
    requests: {
      request: Requests;
      executor: Performer | null;
      performer: Performer | null;
    }[];
    pagination: Pagination;
    status: "idle" | "loading" | "succeeded" | "failed";
  }

  const initialState: RequestsState = {
    requests: [],
    pagination: { totalPages: 1, currentPage: 1, limit: 10, total: 0 },
    status: "idle",
  };

  // Преобразуем объект параметров в строку
  const serializeParams = (params: Record<string, string | number>): string => {
    const stringParams: Record<string, string> = {};
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        stringParams[key] = String(params[key]);
      }
    }
    return new URLSearchParams(stringParams).toString();
  };

  // Создаем асинхронный thunk для получения заявок
  export const fetchRequests = createAsyncThunk(
    "requests/fetchRequests",
    async (params: FilterParams) => {
      const queryString = serializeParams(
        params as Record<string, string | number>
      );
      const response = await fetch(`request-data/filtered?${queryString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      return response.json();
    }
  );

  const requestsSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchRequests.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchRequests.fulfilled, (state, action) => {
          const { requests, totalPages, currentPage, limit, total } =
            action.payload;

          state.requests = requests || [];
          state.pagination = {
            totalPages: totalPages || 1,
            currentPage: currentPage || 1,
            limit: limit || 10,
            total: total || 0,
          };
          state.status = "succeeded";
        })
        .addCase(fetchRequests.rejected, (state) => {
          state.status = "failed";
        });
    },
  });

  export default requestsSlice.reducer;

  export const selectRequests = (state: RootState) => state.requests.requests;
  export const selectPagination = (state: RootState) => state.requests.pagination;
