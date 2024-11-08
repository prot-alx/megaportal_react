import { cn } from "@/shared/utils";
import { FC } from "react";
import { NavLink } from "react-router-dom";

interface MenuListItem {
  id: number;
  text: string;
  link: string;
}

interface MenuListProps {
  items: MenuListItem[];
  onItemClick?: () => void;
}

export const MenuList: FC<MenuListProps> = ({ items, onItemClick }) => {
  return (
    <div className="flex justify-center">
      <ul className="flex flex-col gap-2 items-start xl:flex-row xl:items-center">
        {items.map((item) => (
          <li className="flex justify-center" key={item.id}>
            <NavLink
              to={item.link}
              onClick={onItemClick}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 align-middle",
                  isActive
                    ? "bg-slate-300 text-black"
                    : "bg-transparent text-black hover:bg-gray-200"
                )
              }
            >
              {item.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};