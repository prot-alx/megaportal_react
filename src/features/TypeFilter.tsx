import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import { RequestType, Requests } from "@/app/services/requestApi";
import {
  selectSelectedTypes,
  setSelectAllTypes,
  toggleType,
} from "@/entities/slices/filterSlice";
import { RiFilterLine } from "@remixicon/react";

interface TypeFilterProps {
  fetchedRequests: Requests[];
}

// Метки для типов заявок
const requestTypeLabels: Record<RequestType, string> = {
  [RequestType.Default]: "Обычный",
  [RequestType.VIP]: "VIP",
  [RequestType.Video]: "Видеонаблюдение",
  [RequestType.Optical]: "Оптика/НОБ",
  [RequestType.Other]: "По служебкам/По указанию",
};

export const TypeFilter: React.FC<TypeFilterProps> = ({
  fetchedRequests = [],
}) => {
  const dispatch = useDispatch();
  const selectedTypes = useSelector(selectSelectedTypes);

  const allTypes = Object.values(RequestType);

  // Логика выбора всех чекбоксов: если длина массивов совпадает, считаем, что выбрано всё
  const selectAll = selectedTypes.length === allTypes.length;

  // Логика для изменения цвета триггера
  const isPartiallySelected = selectedTypes.length > 0 && !selectAll;

  // Подсчёт количества заявок по каждому типу
  const requestCountByType = useMemo(() => {
    return allTypes.reduce((acc, type) => {
      acc[type] = fetchedRequests.filter((req) => req.type === type).length;
      return acc;
    }, {} as Record<RequestType, number>);
  }, [fetchedRequests, allTypes]);

  // Обработчик изменения состояния чекбокса для отдельных типов
  const handleCheckboxChange = (type: RequestType) => {
    dispatch(toggleType(type));
  };

  // Обработчик для чекбокса "Выбрать все"
  const handleSelectAllChange = () => {
    dispatch(setSelectAllTypes(!selectAll));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`flex bg-white w-[130px] h-10 px-4 py-2 items-center justify-between whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
            ${
              isPartiallySelected
                ? "text-gray-100 bg-gray-400"
                : "text-gray-500 hover:bg-slate-300 hover:text-gray-800"
            }`}
        >
          <p>Тип</p>
          <RiFilterLine size="15px" className="block" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-4 hidden xl:flex xl:flex-col">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectAll}
            onCheckedChange={handleSelectAllChange}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Выбрать все ({fetchedRequests.length})
          </label>
        </div>
        <div className="mt-2">
          {allTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => handleCheckboxChange(type)}
              />
              <label
                htmlFor={type}
                className={`text-sm font-medium ${
                  selectAll ? "text-gray-500 opacity-60" : ""
                }`}
              >
                {requestTypeLabels[type]} ({requestCountByType[type]})
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
