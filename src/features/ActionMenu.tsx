import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { RiSettings2Line } from "@remixicon/react";
import { Button } from "@/shared/components";
import ActionButton from "@/entities/buttons/ActionButton";

interface ActionMenuProps {
  actions: {
    id: string;
    action: () => void;
    tooltipText: string;
    icon: React.ReactNode;
    isEnabled: boolean;
    disabledText?: string;
  }[];
  menuButtonClassName?: string;
  menuWidth?: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  actions,
  menuButtonClassName = "w-[40px] opacity-20 hover:opacity-100",
  menuWidth = "w-[50px]",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="button"
          aria-expanded={open}
          className={menuButtonClassName}
        >
          <RiSettings2Line className="ml-auto min-h-6 min-w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={
          menuWidth + " p-0 py-1 relative -right-14 -top-20 shadow-2xl"
        }
        align="end"
        autoFocus={false}
      >
        <div className="flex flex-col gap-2 justify-around items-center">
          {actions.map((actionProps) => (
            <ActionButton
              key={actionProps.id}
              id={actionProps.id}
              action={actionProps.action}
              tooltipText={actionProps.tooltipText}
              icon={actionProps.icon}
              isEnabled={actionProps.isEnabled}
              disabledText={actionProps.disabledText}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ActionMenu;
