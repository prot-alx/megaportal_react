import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestType } from "@/app/services/requestApi";
import { RootState } from "@/app/store/store";

interface FilterState {
  selectedTypes: RequestType[];
  selectedDateFilters: string[];
}

const initialState: FilterState = {
  selectedTypes: Object.values(RequestType),
  selectedDateFilters: ["all", "today", "past", "future"],
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleType(state, action: PayloadAction<RequestType>) {
      const type = action.payload;
      // Если выбрано "Все", и кликнули на тип — снимаем "Выбрать все"
      if (state.selectedTypes.length === Object.values(RequestType).length) {
        state.selectedTypes = [type];
      } else if (state.selectedTypes.includes(type)) {
        // Убираем тип из списка, если он был выбран
        state.selectedTypes = state.selectedTypes.filter((t) => t !== type);
      } else {
        // Добавляем тип в список, если он не был выбран
        state.selectedTypes.push(type);

        // Если после добавления все типы выбраны — активируем "Выбрать все"
        if (state.selectedTypes.length === Object.values(RequestType).length) {
          state.selectedTypes = Object.values(RequestType);
        }
      }
    },
    setSelectAllTypes: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.selectedTypes = Object.values(RequestType);
      } else {
        state.selectedTypes = [];
      }
    },
    setSelectedDateFilters(state, action: PayloadAction<string[]>) {
      state.selectedDateFilters = action.payload;
      console.log(action.payload);
    },
    toggleDateFilter(state, action: PayloadAction<string>) {
      const filter = action.payload;
      let updatedFilters: string[];

      if (filter === "all") {
        updatedFilters = state.selectedDateFilters.includes("all")
          ? []
          : ["all", "today", "past", "future"];
      } else {
        const isFilterSelected = state.selectedDateFilters.includes(filter);

        if (state.selectedDateFilters.includes("all")) {
          updatedFilters = [filter];
        } else {
          updatedFilters = isFilterSelected
            ? state.selectedDateFilters.filter((f) => f !== filter)
            : [...state.selectedDateFilters, filter];
        }

        if (updatedFilters.length === 3 && !updatedFilters.includes("all")) {
          updatedFilters.push("all");
        }
      }
      state.selectedDateFilters = updatedFilters;
    },
    applyFilters: (state) => {
      console.log(state);
      // Можно добавить экшен для применения фильтров
    },
  },
});

export const {
  toggleType,
  setSelectAllTypes,
  setSelectedDateFilters,
  applyFilters,
  toggleDateFilter,
} = filterSlice.actions;

export const selectSelectedTypes = (state: RootState) =>
  state.filters.selectedTypes;
export const selectSelectedDateFilters = (state: RootState) =>
  state.filters.selectedDateFilters;

export default filterSlice.reducer;
