import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { RequestType } from "@/app/services/requestApi";
import React from "react";

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
}

export const RequestTypeSelector: React.FC<RequestTypeSelectorProps> = ({
  requestId,
  initialType,
  onTypeChange,
}) => {
  const [selectedType, setSelectedType] =
    React.useState<RequestType>(initialType);

  // Обновляем состояние, если пропс initialType изменился
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

  return (
    <div>
      <Select value={selectedType} onValueChange={handleSelect}>
        <SelectTrigger className="w-[150px]">
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
