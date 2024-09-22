import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, parse, isToday, isBefore } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";

const parseDateString = (dateString: string): Date => {
  return parse(dateString, "dd-MM-yyyy", new Date(), { locale: ru });
};

const getInitialDate = (initialDate?: string): Date => {
  return initialDate ? parseDateString(initialDate) : new Date();
};

interface DatePickerProps {
  id: number;
  initialDate?: string;
  onDateChange?: (id: number, date: Date) => void;
  requestStatus: string;
}

export const RequestDatePicker: React.FC<DatePickerProps> = ({
  id,
  initialDate,
  onDateChange,
  requestStatus,
}) => {
  const [someDate, setSomeDate] = React.useState<Date | undefined>(
    getInitialDate(initialDate)
  );

  React.useEffect(() => {
    setSomeDate(getInitialDate(initialDate));
  }, [initialDate]);

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate && selectedDate.getTime() !== someDate?.getTime()) {
      setSomeDate(selectedDate);
      onDateChange?.(id, selectedDate);
    }
  };

  const getButtonColorClass = (date: Date | undefined) => {
    if (!date) return "";
    if (isToday(date)) return "bg-green-200";
    if (isBefore(date, new Date())) return "bg-yellow-200";

    return "bg-gray-200";
  };

  const buttonColorClass = getButtonColorClass(someDate);

  // Если статус закрыт или отменен, выводим строковое представление даты
  if (requestStatus === "CLOSED" || requestStatus === "CANCELLED") {
    return (
      <div className="text-gray-800">
        {someDate
          ? format(someDate, "d MMMM yyyy", { locale: ru })
          : "Дата не указана"}
      </div>
    );
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal xl:w-[180px]",
              buttonColorClass,
              !someDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {someDate ? (
              format(someDate, "d MMMM yyyy", { locale: ru })
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={someDate}
            onSelect={handleDateChange}
            initialFocus
            locale={ru}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
