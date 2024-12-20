import { MenuList } from "@/widgets";
import { topmenu } from "../model";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: typeof topmenu.items;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start p-4 xl:hidden">
      <div className="bg-white rounded-lg w-64 p-4 shadow-lg">
        <MenuList items={items} onItemClick={onClose} />
      </div>
    </div>
  );
};
