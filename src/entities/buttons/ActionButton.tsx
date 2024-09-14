import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";

interface ActionButtonProps {
  id: string;
  action: () => void;
  tooltipText: string;
  icon: React.ReactNode;
  isEnabled: boolean;
  disabledText?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  tooltipText,
  icon,
  isEnabled,
  disabledText,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            autoFocus={false}
            tabIndex={-1}
            variant="outline"
            onClick={isEnabled ? action : undefined}
            className="w-[40px] h-[40px] focus:outline-none shadow-sm"
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isEnabled ? tooltipText : disabledText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionButton;
