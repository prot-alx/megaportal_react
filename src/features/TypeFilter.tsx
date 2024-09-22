import React, { useState } from "react";
import { RequestType } from "@/app/services/requestApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface RequestTypeFilterProps {
  selectedTypes: RequestType[];
  onTypeChange: (type: RequestType) => void;
}

const RequestTypeFilter: React.FC<RequestTypeFilterProps> = ({
  selectedTypes,
  onTypeChange,
}) => {
  const requestTypes = Object.values(RequestType);
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (type: RequestType) => {
    onTypeChange(type);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className="bg-white border border-gray-300 rounded px-4 py-2 w-[130px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        Типы
      </DropdownMenuTrigger>
      {isOpen && (
        <DropdownMenuContent className="w-28 p-2">
          {requestTypes.map((type) => (
            <div key={type}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleCheckboxChange(type)}
                />
                <span>{type}</span>
              </label>
            </div>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default RequestTypeFilter;
