import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import {
  selectSelectedDateFilters,
  toggleDateFilter,
} from "@/entities/slices/filterSlice";
import { RiFilterLine } from "@remixicon/react";

interface DateFilterProps {
  dateFilterCounts: {
    all: number;
    today: number;
    past: number;
    future: number;
  };
}

export const DateFilter: React.FC<DateFilterProps> = ({ dateFilterCounts }) => {
  const dispatch = useDispatch();
  const selectedDateFilters = useSelector(selectSelectedDateFilters);

  const isAllSelected = selectedDateFilters.includes("all");

  const allDateFilters = [
    { label: "Все заявки", filter: "all", count: dateFilterCounts.all },
    { label: "Сегодня", filter: "today", count: dateFilterCounts.today },
    { label: "Прошлые", filter: "past", count: dateFilterCounts.past },
    { label: "Будущие", filter: "future", count: dateFilterCounts.future },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex bg-white text-gray-500 w-[150px] hover:bg-slate-300 hover:text-gray-800 cursor-pointer h-10 px-4 py-2 items-center justify-around whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <p>Дата</p>
          <RiFilterLine size="15px" className="block"/>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-4 hidden xl:flex xl:flex-col">
        <div className="space-y-2">
          {allDateFilters.map(({ label, filter, count }) => {
            const itemStyle =
              isAllSelected && filter !== "all"
                ? "text-gray-500 opacity-60"
                : "";

            return (
              <div key={filter} className="flex items-center space-x-2">
                <Checkbox
                  id={filter}
                  checked={selectedDateFilters.includes(filter)}
                  onCheckedChange={() => dispatch(toggleDateFilter(filter))}
                />
                <label
                  htmlFor={filter}
                  className={`text-sm font-medium flex items-center space-x-2 ${itemStyle}`}
                >
                  <span>{label}</span>
                  <span className="ml-2 text-gray-500">({count})</span>
                </label>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
