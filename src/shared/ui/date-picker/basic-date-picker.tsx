import React from "react";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared";
import { cn } from "@/shared/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, parse } from "date-fns";
import { ru } from "date-fns/locale";

const parseDateString = (dateString: string): Date => {
  return parse(dateString, "dd-MM-yyyy", new Date(), { locale: ru });
};

interface BasicDatePickerProps {
  initialDate?: string;
  onDateChange?: (date: Date | undefined) => void;
}

export const BasicDatePicker: React.FC<BasicDatePickerProps> = ({
  initialDate,
  onDateChange,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(
    initialDate ? parseDateString(initialDate) : undefined
  );

  React.useEffect(() => {
    onDateChange?.(date);
  }, [date, onDateChange]);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[170px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "d MMMM yyyy", { locale: ru })
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            locale={ru}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
