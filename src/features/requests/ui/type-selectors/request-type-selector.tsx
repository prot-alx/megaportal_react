import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared";
import { RequestType } from "@/app/services/types/request.types";

// Сопоставление значений RequestType с отображаемыми текстами
const requestTypeLabels: Record<RequestType, string> = {
  [RequestType.Default]: "Обычный",
  [RequestType.VIP]: "VIP",
  [RequestType.Video]: "Видео",
  [RequestType.Optical]: "Оптика/НОБ",
  [RequestType.Other]: "Служебка",
};

interface RequestTypeSelectorProps {
  requestId: number;
  initialType: RequestType;
  onTypeChange: (id: number, newType: RequestType) => void;
  requestStatus: string;
}

export const RequestTypeSelector: React.FC<RequestTypeSelectorProps> = ({
  requestId,
  initialType,
  onTypeChange,
  requestStatus,
}) => {
  const [selectedType, setSelectedType] =
    React.useState<RequestType>(initialType);

  React.useEffect(() => {
    setSelectedType(initialType);
  }, [initialType]);

  const handleSelect = (value: string) => {
    const newType = value as RequestType;
    if (newType !== selectedType) {
      setSelectedType(newType);
      onTypeChange(requestId, newType);
    }
  };

  if (requestStatus === "CLOSED" || requestStatus === "CANCELLED") {
    return <div>{requestTypeLabels[selectedType] || "-"}</div>;
  }

  return (
    <div>
      <Select value={selectedType} onValueChange={handleSelect}>
        <SelectTrigger className="w-[200px] xl:w-[130px]">
          <SelectValue placeholder="Select Request Type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(requestTypeLabels).map(([type, label]) => (
            <SelectItem key={type} value={type}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
