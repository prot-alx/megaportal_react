import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared";
import { RequestType } from "@/app/services/types/request.types";

const requestTypeLabels: Record<RequestType, string> = {
  [RequestType.Default]: "Обычный",
  [RequestType.VIP]: "VIP",
  [RequestType.Video]: "Видео",
  [RequestType.Optical]: "Оптика/НОБ",
  [RequestType.Other]: "Служебка",
};

interface RequestTypeSelectorNoIdProps {
  initialType: RequestType;
  onTypeChange: (newType: RequestType) => void;
}

export const RequestTypeSelectorNoId: React.FC<
  RequestTypeSelectorNoIdProps
> = ({ initialType, onTypeChange }) => {
  const [selectedType, setSelectedType] =
    React.useState<RequestType>(initialType);

  React.useEffect(() => {
    setSelectedType(initialType);
  }, [initialType]);

  const handleSelect = (value: string) => {
    const newType = value as RequestType;
    if (newType !== selectedType) {
      setSelectedType(newType);
      onTypeChange(newType);
    }
  };

  return (
    <div>
      <Select
        value={selectedType}
        onValueChange={handleSelect}
        name="request_type"
      >
        <SelectTrigger id="request_type_select" className="w-[150px]">
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
