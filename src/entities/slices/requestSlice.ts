import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Requests } from "@/app/services/requestApi";
import {
  startOfDay,
  endOfDay,
  isToday,
  isBefore,
  isAfter,
  parse,
  format,
} from "date-fns";
import { applyFilters } from "./filterSlice";
import { RootState } from "@/app/store/store";

interface RequestState {
  requests: Requests[];
  filteredRequests: Requests[];
  dateFilterCounts: {
    all: number;
    today: number;
    past: number;
    future: number;
  };
  totalPages: number;
  currentPage: number;
  filters: {
    status?: string;
    type?: string[];
    startDate?: string;
    endDate?: string;
  };
}

const initialState: RequestState = {
  requests: [],
  filteredRequests: [],
  dateFilterCounts: {
    all: 0,
    today: 0,
    past: 0,
    future: 0,
  },
  totalPages: 0, // Инициализация
  currentPage: 1, // Инициализация
  filters: {}, // Инициализация фильтров
};

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequests(
      state,
      action: PayloadAction<{
        data: Requests[];
        totalPages: number;
        page: number;
      }>
    ) {
      const { data, totalPages, page } = action.payload;
      const today = new Date();

      const parsedRequests = data
        .map((req) => {
          const parsedDate = parse(req.request_date, "dd-MM-yyyy", new Date());
          const formattedDate = format(parsedDate, "dd-MM-yyyy");

          return {
            ...req,
            request_date: formattedDate,
          };
        })
        .sort((a, b) => b.id - a.id);

      const counts = {
        all: parsedRequests.length,
        today: parsedRequests.filter((req) =>
          isToday(parse(req.request_date, "dd-MM-yyyy", new Date()))
        ).length,
        past: parsedRequests.filter((req) =>
          isBefore(
            parse(req.request_date, "dd-MM-yyyy", new Date()),
            startOfDay(today)
          )
        ).length,
        future: parsedRequests.filter((req) =>
          isAfter(
            parse(req.request_date, "dd-MM-yyyy", new Date()),
            endOfDay(today)
          )
        ).length,
      };

      state.dateFilterCounts = counts;
      state.requests = parsedRequests;
      state.filteredRequests = parsedRequests;
      state.totalPages = totalPages; // Установка общего количества страниц
      state.currentPage = page; // Установка текущей страницы
    },
    setFilters(
      state,
      action: PayloadAction<{
        status?: string;
        type?: string[];
        startDate?: string;
        endDate?: string;
      }>
    ) {
      state.filters = action.payload; // Установка фильтров в состояние
    },
  },
  extraReducers: (builder) => {
    builder.addCase(applyFilters, (state, action) => {
      const rootState = action.payload as unknown as RootState;
      const selectedTypes = rootState.filters.selectedTypes;
      const selectedDateFilters = rootState.filters.selectedDateFilters;

      state.filteredRequests = state.requests.filter((request) => {
        // Фильтрация по типам
        const typeMatch =
          selectedTypes.length === 0 || selectedTypes.includes(request.type);

        // Фильтрация по датам
        const date = parse(request.request_date, "dd-MM-yyyy", new Date());
        const dateMatch =
          selectedDateFilters.includes("all") ||
          (selectedDateFilters.includes("today") && isToday(date)) ||
          (selectedDateFilters.includes("past") &&
            isBefore(date, startOfDay(new Date()))) ||
          (selectedDateFilters.includes("future") &&
            isAfter(date, endOfDay(new Date())));

        return typeMatch && dateMatch;
      });
    });
  },
});

export const { setRequests, setFilters } = requestSlice.actions;

export default requestSlice.reducer;
